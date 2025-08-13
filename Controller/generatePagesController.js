// controllers/generatePagesController.js

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const axios = require("axios");
const { PDFDocument } = require("pdf-lib");
const { XXHash64 } = require("xxhash-addon");
const { Worker } = require("worker_threads");
const { v2: cloudinary } = require("cloudinary");

if (!cloudinary.config().cloud_name && process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const generate10DigitId = require("../utils/uidGenerator");
const generateQrCode = require("../utils/generateQr");
const uploadOnCloudinary = require("../utils/cloudinary");
const checkQR = require("../utils/qrScanner");
const GeneratedPage = require("../Models/GeneratedPage");
const redisClient = require("../utils/redis");

const templates = {
  template1: path.join(__dirname, "../templates/template.pdf"),
  template2: path.join(__dirname, "../templates/simplepage.pdf"),
};

const norm = (v) => String(v ?? "").trim();
const normalizeHash = (h) =>
  String(h ?? "")
    .trim()
    .toLowerCase();

const hashFileWithXxhash = (filePath) =>
  new Promise((resolve, reject) => {
    const seed = Buffer.alloc(8);
    const hasher = new XXHash64(seed);
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hasher.update(chunk));
    stream.on("end", () => resolve(hasher.digest("hex")));
    stream.on("error", reject);
  });

const hashBufferWithXxhash = (buf) => {
  const seed = Buffer.alloc(8);
  const hasher = new XXHash64(seed);
  hasher.update(buf);
  return hasher.digest("hex");
};

async function redisGetJSON(key) {
  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function redisSetJSON(key, obj) {
  try {
    await redisClient.set(key, JSON.stringify(obj));
  } catch {}
}

function genQrInWorker(qrUrl) {
  return new Promise((resolve, reject) => {
    const code = `
      const { parentPort, workerData } = require("worker_threads");
      (async () => {
        try {
          const generateQrCode = require(${JSON.stringify(
            path.join(__dirname, "../utils/generateQr")
          )});
          const dataUrl = await generateQrCode(workerData.qrUrl);
          parentPort.postMessage({ ok: true, dataUrl });
        } catch (err) {
          parentPort.postMessage({ ok: false, error: err.message || String(err) });
        }
      })();
    `;
    const w = new Worker(code, { eval: true, workerData: { qrUrl } });
    w.once("message", (msg) => {
      if (msg.ok) resolve(msg.dataUrl);
      else reject(new Error(msg.error || "QR worker failed"));
    });
    w.once("error", reject);
  });
}

function checkQrInWorker(filePath) {
  return new Promise((resolve, reject) => {
    const code = `
      const { parentPort, workerData } = require("worker_threads");
      (async () => {
        try {
          const checkQR = require(${JSON.stringify(
            path.join(__dirname, "../utils/qrScanner")
          )});
          const result = await checkQR(workerData.filePath);
          parentPort.postMessage({ ok: true, result });
        } catch (err) {
          parentPort.postMessage({ ok: false, error: err.message || String(err) });
        }
      })();
    `;
    const w = new Worker(code, { eval: true, workerData: { filePath } });
    w.once("message", (msg) => {
      if (msg.ok) resolve(msg.result);
      else reject(new Error(msg.error || "QR scan worker failed"));
    });
    w.once("error", reject);
  });
}

function uploadBufferToCloudinary(
  buffer,
  folder = "qr_uploads",
  publicId = undefined
) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto",
    };
    if (publicId) uploadOptions.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.once("error", reject);
    stream.end(buffer);
  });
}

exports.generatePages = async (req, res) => {
  try {
    const { templateName, numberOfPages } = req.body;

    if (!templates[templateName]) {
      return res.status(400).json({ error: "Invalid template selected" });
    }

    const templateBytes = fs.readFileSync(templates[templateName]);
    const templatePdf = await PDFDocument.load(templateBytes);
    const finalPdf = await PDFDocument.create();

    const qrPositions = {
      template2: { x: 470, y: 50 },
      template1: { x: 650, y: 140 },
    };
    const position = qrPositions[templateName] || { x: 500, y: 50 };

    for (let i = 0; i < Number(numberOfPages || 0); i++) {
      const qrId = norm(generate10DigitId());
      const qrUrl = `http://localhost:5000/qr/${qrId}`;
      const qrDataUrl = await generateQrCode(qrUrl);
      const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");

      const [templatePage] = await finalPdf.copyPages(templatePdf, [0]);
      const qrImage = await finalPdf.embedPng(qrImageBytes);

      templatePage.drawImage(qrImage, {
        x: position.x,
        y: position.y,
        width: 90,
        height: 100,
      });

      templatePage.drawText(`QR ID: ${qrId}`, {
        x: position.x,
        y: position.y - 10,
        size: 12,
      });

      finalPdf.addPage(templatePage);
    }

    const finalPdfBytes = await finalPdf.save();
    const outputFilename = `merged_qr_pages_${Date.now()}.pdf`;
    const tempDir = path.join(__dirname, "../temp_qr_pdfs");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const outputPath = path.join(tempDir, outputFilename);

    fs.writeFileSync(outputPath, finalPdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${outputFilename}`
    );
    res.sendFile(outputPath, (err) => {
      if (!err) fs.unlinkSync(outputPath);
    });
  } catch (error) {
    res.status(500).json({
      error: "QR generation failed",
      message: error.message,
    });
  }
};

const processFile = async (filePath) => {
  try {
    const fileBuffer = await fsp.readFile(filePath);
    const rawHash = hashBufferWithXxhash(fileBuffer);
    const hash = normalizeHash(rawHash);

    const cached = await redisGetJSON(`hash:${hash}`);
    if (cached) {
      const newUploadResult = await uploadOnCloudinary(
        fileBuffer,
        "qr_uploads",
        false
      );
      fsp.unlink(filePath).catch(() => {});
      return {
        status: "duplicate",
        hash,
        oldHash: hash,
        qrId: cached.qrId || null,
        existingFileUrl: cached.fileUrl || null,
        newFileUrl: newUploadResult?.secure_url || null,
      };
    }

    const existingRecord = await GeneratedPage.findOne({
      "uploadedCopies.hash": hash,
    }).lean();

    if (existingRecord) {
      const existingCopy = existingRecord.uploadedCopies.find(
        (c) => c.hash === hash
      );
      const existingFileUrl = existingCopy?.fileUrl || null;
      const newUploadResult = await uploadOnCloudinary(
        fileBuffer,
        "qr_uploads",
        false
      );
      await redisSetJSON(`hash:${hash}`, {
        qrId: existingRecord.qrId,
        fileUrl: existingFileUrl,
      });
      fsp.unlink(filePath).catch(() => {});
      return {
        status: "duplicate",
        hash,
        oldHash: hash,
        qrId: existingRecord.qrId,
        existingFileUrl,
        newFileUrl: newUploadResult?.secure_url || null,
      };
    }

    const uploadPromise = uploadOnCloudinary(fileBuffer, "qr_uploads", false);
    const qrDataPromise = checkQrInWorker(filePath);
    const [uploadResult, qrData] = await Promise.all([
      uploadPromise,
      qrDataPromise,
    ]);

    if (!qrData?.qrId) {
      fsp.unlink(filePath).catch(() => {});
      return { status: "failed", error: "QR code not found" };
    }

    const qrId = norm(qrData.qrId);
    if (!uploadResult?.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    const copy = {
      fileName:
        uploadResult.public_id || path.basename(uploadResult.secure_url),
      fileUrl: uploadResult.secure_url,
      hash,
      uploadedAt: new Date(),
    };

    GeneratedPage.findOneAndUpdate(
      { qrId },
      {
        $setOnInsert: {
          qrId,
          templateName: undefined,
          fileUrl: undefined,
          pendingDuplicates: [],
          uploadedAt: new Date(),
        },
        $push: { uploadedCopies: copy },
      },
      { upsert: true, new: true }
    ).exec();

    await redisSetJSON(`hash:${hash}`, {
      qrId,
      fileUrl: uploadResult.secure_url,
    });

    fsp.unlink(filePath).catch(() => {});

    return {
      status: "uploaded",
      hash,
      qrId,
      fileUrl: uploadResult.secure_url,
      qrData: qrData.rawData || qrData,
    };
  } catch (err) {
    fsp.unlink(filePath).catch(() => {});
    return { status: "failed", error: err.message };
  }
};

exports.uploadHRPage = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    if (!uploadedFiles?.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    if (uploadedFiles.length > 10) {
      return res
        .status(400)
        .json({ message: "Upload limit exceeded. Max 10 files allowed." });
    }

    const results = await Promise.allSettled(
      uploadedFiles.map((file) => processFile(file.path))
    );

    const uploaded = [];
    const duplicates = [];
    const failed = [];

    for (const r of results) {
      if (r.status === "fulfilled") {
        const data = r.value;
        if (data.status === "uploaded") {
          uploaded.push(data);
        } else if (data.status === "duplicate") {
          duplicates.push({
            hash: data.hash,
            oldHash: data.oldHash,
            qrId: data.qrId,
            existingFileUrl: data.existingFileUrl || null,
            newFileUrl: data.newFileUrl || null,
          });
        } else {
          failed.push(data);
        }
      } else {
        failed.push({ error: r.reason?.message || "Unknown error" });
      }
    }

    return res.status(200).json({ uploaded, duplicates, failed });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.toString(),
    });
  }
};

exports.getUploadsByQrId = async (req, res) => {
  try {
    const qrId = norm(req.params.qrId);
    const page = await GeneratedPage.findOne({ qrId }).lean();
    if (!page) return res.status(404).send("No files found for this QR ID.");

    let html = `<html><head><title>QR Files - ${qrId}</title></head><body>`;
    html += `<h2>Documents for QR ID: ${qrId}</h2>`;

    for (const copy of page.uploadedCopies || []) {
      const ext = path.extname(copy.fileName || "").toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        html += `<div><img src="${copy.fileUrl}" style="max-width: 100%; margin-bottom: 20px;" /></div>`;
      } else if (ext === ".pdf") {
        html += `<div style="margin-bottom: 20px;">
          <iframe src="${copy.fileUrl}" width="100%" height="500px" style="border:1px solid #ccc;"></iframe>
          <p><a href="${copy.fileUrl}" target="_blank">${copy.fileName}</a></p>
        </div>`;
      } else {
        html += `<div><a href="${copy.fileUrl}" target="_blank">${copy.fileName}</a></div>`;
      }
    }

    html += `</body></html>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.replaceUploadedFile = async (req, res) => {
  try {
    const { qrId, oldHash, newFileUrl } = req.body;

    if (!qrId || !oldHash || !newFileUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normOldHash = normalizeHash(oldHash);
    const page = await GeneratedPage.findOne({
      qrId: qrId,
      "uploadedCopies.hash": normOldHash,
    });

    if (!page) {
      return res
        .status(404)
        .json({ message: "File with given hash not found" });
    }

    const fileResp = await axios.get(newFileUrl, {
      responseType: "arraybuffer",
    });
    const tempBuffer = Buffer.from(fileResp.data);
    const newHash = normalizeHash(hashBufferWithXxhash(tempBuffer));
    const cloudinaryResult = await uploadBufferToCloudinary(
      tempBuffer,
      "qr_uploads"
    );

    if (!cloudinaryResult?.secure_url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const index = page.uploadedCopies.findIndex((c) => c.hash === normOldHash);
    if (index === -1) {
      return res.status(404).json({ message: "Old file to replace not found" });
    }

    page.uploadedCopies[index] = {
      fileName:
        cloudinaryResult.public_id ||
        path.basename(cloudinaryResult.secure_url),
      fileUrl: cloudinaryResult.secure_url,
      hash: newHash,
      uploadedAt: new Date(),
    };

    await page.save();
    await redisSetJSON(`hash:${newHash}`, {
      qrId: page.qrId,
      fileUrl: cloudinaryResult.secure_url,
    });
    await redisClient.del(`hash:${normOldHash}`);

    res.status(200).json({
      message: "Replacement successful",
      fileUrl: cloudinaryResult.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Replacement failed",
      error: error.toString(),
    });
  }
};

exports.Stats = async (req, res) => {
  try {
    const allDocs = await GeneratedPage.find({});
    const generatedQR = allDocs.length;
    const uploadedDocs = allDocs.reduce(
      (sum, doc) => sum + (doc.uploadedCopies?.length || 0),
      0
    );

    res.json({ generatedQR, uploadedDocs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
