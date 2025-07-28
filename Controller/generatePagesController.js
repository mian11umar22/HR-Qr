const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const generateQrCode = require("../utils/generateQr");
const GeneratedPage = require("../Models/GeneratedPage");
const getFileHash = require("../utils/getFileHash");
const generate10DigitId = require("../utils/uidGenerator");
const checkQR = require("../utils/qrScanner");
const crypto = require("crypto");

const templates = {
  template1: path.join(__dirname, "../templates/template.pdf"),
  template2: path.join(__dirname, "../templates/simplepage.pdf"),
};

// ✅ Utility function for environment-aware base URL
function getBaseUrl(req) {
  if (process.env.NODE_ENV === "production") {
    return "https://hr-qr-production.up.railway.app";
  } else {
    return `${req.protocol}://${req.get("host")}`;
  }
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
      template2: { x: 500, y: 50 },
      template1: { x: 680, y: 120 },
    };

    const position = qrPositions[templateName] || qrPositions["template1"];

    for (let i = 0; i < numberOfPages; i++) {
      const qrId = generate10DigitId();
      const qrUrl = `${getBaseUrl(req)}/qr/${qrId}`;
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

      finalPdf.addPage(templatePage);

      const pdfPreview = await finalPdf.save();
      const fileHash = getFileHash(pdfPreview);

      await GeneratedPage.create({
        qrId,
        templateName,
        fileUrl: "inline",
        fileHash,
      });
    }

    const finalPdfBytes = await finalPdf.save();
    const outputFilename = `merged_qr_pages_${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "../temp_qr_pdfs", outputFilename);

    const tempDir = path.join(__dirname, "../temp_qr_pdfs");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    fs.writeFileSync(outputPath, finalPdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${outputFilename}`
    );
    res.sendFile(outputPath, (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      } else {
        console.error("❌ SendFile error:", err);
      }
    });
  } catch (error) {
    console.error("❌ Detailed Error:", error);
    res.status(500).json({
      error: "QR generation failed",
      message: error.message,
    });
  }
};

exports.uploadHRPage = async (req, res) => {
  try {
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // ✅ Ensure public/uploads directory exists
    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploaded = [];
    const duplicates = [];

    for (const file of uploadedFiles) {
      const filePath = file.path;
      const qrUrl = await checkQR(filePath);
      const qrId = qrUrl.split("/").pop();

      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      const fileUrl = `${getBaseUrl(req)}/uploads/${file.filename}`;

      let page = await GeneratedPage.findOne({ qrId });

      if (!page) {
        page = new GeneratedPage({
          qrId,
          fileHash: hash,
          fileUrl,
          uploadedCopies: [],
        });
      }

      const isDuplicate = page.uploadedCopies.some((c) => c.hash === hash);

      if (isDuplicate) {
        const existingCopy = page.uploadedCopies.find((c) => c.hash === hash);
        duplicates.push({
          qrId,
          file: file.originalname,
          existingFile: `${getBaseUrl(req)}/uploads/${existingCopy.fileName}`,
          newFile: fileUrl,
        });
        continue;
      }

      page.uploadedCopies.push({
        fileName: file.filename,
        fileUrl,
        hash,
        uploadedAt: new Date(),
      });

      await page.save();

      uploaded.push({
        file: file.originalname,
        qrId,
        fileUrl,
      });
    }

    console.log("🔁 Sending to frontend:", { uploaded, duplicates });

    return res.status(200).json({ uploaded, duplicates });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.toString() });
  }
};

exports.getUploadsByQrId = async (req, res) => {
  try {
    const { qrId } = req.params;
    const pages = await GeneratedPage.find({ qrId });

    if (!pages || pages.length === 0) {
      return res.status(404).send("No files found for this QR ID.");
    }

    const allFiles = [];
    for (const page of pages) {
      for (const copy of page.uploadedCopies) {
        const fileUrl = `${getBaseUrl(req)}/uploads/${copy.fileName}`;
        allFiles.push({ fileName: copy.fileName, fileUrl });
      }
    }

    let html = `<html><head><title>QR Files - ${qrId}</title></head><body>`;
    html += `<h2>Documents for QR ID: ${qrId}</h2>`;

    allFiles.forEach((file) => {
      const ext = path.extname(file.fileName).toLowerCase();

      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        html += `<div><img src="${file.fileUrl}" style="max-width: 100%; margin-bottom: 20px;" /></div>`;
      } else if (ext === ".pdf") {
        html += `<div style="margin-bottom: 20px;">
          <iframe src="${file.fileUrl}" width="100%" height="500px" style="border:1px solid #ccc;"></iframe>
          <p><a href="${file.fileUrl}" target="_blank">${file.fileName}</a></p>
        </div>`;
      } else {
        html += `<div><a href="${file.fileUrl}" target="_blank">${file.fileName}</a></div>`;
      }
    });

    html += `</body></html>`;
    res.send(html);
  } catch (err) {
    console.error("Error in getUploadsByQrId:", err);
    res.status(500).send("Server Error");
  }
};

exports.replaceUploadedFile = async (req, res) => {
  try {
    const { qrId, newFileName, newFileUrl, newHash } = req.body;

    if (!qrId || !newFileName || !newFileUrl || !newHash) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const page = await GeneratedPage.findOne({ qrId });
    if (!page) {
      return res
        .status(404)
        .json({ message: "Page not found for given QR ID" });
    }

    // Replace first copy or add new one
    if (page.uploadedCopies.length > 0) {
      page.uploadedCopies[0] = {
        fileName: newFileName,
        fileUrl: newFileUrl,
        hash: newHash,
        uploadedAt: new Date(),
      };
    } else {
      page.uploadedCopies.push({
        fileName: newFileName,
        fileUrl: newFileUrl,
        hash: newHash,
        uploadedAt: new Date(),
      });
    }

    await page.save();

    res.status(200).json({ message: "Replaced successfully", newFileUrl });
  } catch (error) {
    console.error("❌ Replace Error:", error);
    res
      .status(500)
      .json({ message: "Replacement failed", error: error.toString() });
  }
};
