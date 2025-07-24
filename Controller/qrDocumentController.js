const QRDocument = require("../Models/QRDocument");
const generateQrCode = require("../utils/generateQr");
const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const util = require("util");
const checkQR = require("../utils/qrScanner");
const unlinkAsync = util.promisify(fs.unlink);
const fetch = require("node-fetch");

// Force HTTPS in production
const getProtocol = (req) =>
  process.env.NODE_ENV === "production"
    ? "https"
    : req.headers["x-forwarded-proto"] || req.protocol;

// 1. Generate QR Documents
exports.generateQrDocuments = async (req, res) => {
  const { count, templateType } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    const pdfPaths = [];

    const qrCodesDir = path.join(__dirname, "../public/qrcodes");
    if (!fs.existsSync(qrCodesDir)) {
      fs.mkdirSync(qrCodesDir, { recursive: true });
      console.log("✅ Created missing qrcodes folder:", qrCodesDir);
    }

    for (let i = 0; i < count; i++) {
      const qrId = uuidv4();
      const protocol = getProtocol(req);
      const qrUrl = `${protocol}://${req.get("host")}/verify/${qrId}`;
      const qrCode = await generateQrCode(qrUrl);

      const filename = `qr-${qrId}.pdf`;
      const fileUrl = `${protocol}://${req.get("host")}/qrcodes/${filename}`;
      const templateFile =
        templateType === "qr-only" ? "qr_only_template.ejs" : "template.ejs";

      const html = await ejs.renderFile(
        path.join(__dirname, "../views", templateFile),
        { qrCode }
      );

      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      const filePath = path.join(qrCodesDir, filename);
      fs.writeFileSync(filePath, pdfBuffer);
      pdfPaths.push(fileUrl);

      await QRDocument.create({
        qrId,
        templateName: templateType,
        status: "not_uploaded",
        uploadedFileUrl: null,
      });
    }

    await browser.close();
    res.json({ files: pdfPaths });
  } catch (err) {
    console.error("QR generation failed", err);
    res.status(500).send("QR Document generation failed");
  }
};

// 2. Upload scanned files
exports.uploadScannedDocuments = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const updatedDocs = [];

    for (const file of files) {
      const qrData = await checkQR(file.path, file.mimetype);
      console.log("QR Data:", qrData);
      if (!qrData) continue;

      const qrId = qrData.split("/").pop();
      const doc = await QRDocument.findOne({ qrId });
      if (!doc) continue;

      const protocol = getProtocol(req);
      const fileUrl = `${protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;

      doc.uploadedFileUrl = fileUrl;
      doc.status = "uploaded";
      await doc.save();

      updatedDocs.push({ qrId, fileUrl });
    }

    res.json({
      message: "Documents uploaded successfully",
      uploaded: updatedDocs,
    });
  } catch (err) {
    console.error("Upload failed", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// 3. View QR Document (by redirection)
exports.verifyQrDocument = async (req, res) => {
  const { qrId } = req.params;

  try {
    const qrDoc = await QRDocument.findOne({ qrId });

    if (!qrDoc) {
      console.error(`QRDocument not found for qrId: ${qrId}`);
      return res.status(404).send("QR Document not found");
    }

    if (!qrDoc.uploadedFileUrl) {
      console.error(`No uploaded file URL for qrId: ${qrId}`);
      return res.status(404).send("Document not uploaded yet");
    }

    console.log(`Redirecting to: ${qrDoc.uploadedFileUrl}`);
    res.redirect(qrDoc.uploadedFileUrl);
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).send("Internal server error.");
  }
};

// 4. QR Scan + Redirect from uploaded scanned file
exports.uploadAndScanQr = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Please upload a file" });
  }

  const filepath = file.path;
  const filetype = file.mimetype;

  console.log("Scanning file:", { filepath, filetype });

  const qrdata = await checkQR(filepath, filetype);
  if (qrdata) {
    res.status(200).json({
      message: "QR code found!",
      qrdata: qrdata,
      file: file.filename,
    });
  } else {
    res.status(200).json({
      message: "No QR code found in the file.",
      file: file.filename,
    });
  }
};

// 5. Merge PDF files
exports.mergePdfFiles = async (req, res) => {
  const { files } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ message: "No PDF URLs provided." });
  }

  try {
    const { default: PDFMerger } = await import("pdf-merger-js");
    const merger = new PDFMerger();

    for (const url of files) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
      const buffer = await response.buffer();
      const tempFilePath = `temp-${Date.now()}-${Math.random()}.pdf`;
      fs.writeFileSync(tempFilePath, buffer);
      await merger.add(tempFilePath);
      fs.unlinkSync(tempFilePath);
    }

    const mergedBuffer = await merger.saveAsBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
    res.send(mergedBuffer);
  } catch (err) {
    console.error("PDF merge failed:", err);
    res.status(500).json({ message: "PDF merge failed", error: err.message });
  }
};
