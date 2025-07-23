const QRDocument = require("../Models/QRDocument");
const generateQrCode = require("../utils/generateQr");
const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const Jimp = require("jimp");
const util = require("util");
const qrcodeReader = require("qrcode-reader");
const checkQR = require("../utils/qrScanner");
const unlinkAsync = util.promisify(fs.unlink);
 
const fetch = require("node-fetch");

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

    for (let i = 0; i < count; i++) {
      const qrId = uuidv4();
      const qrUrl = `${req.protocol}://${req.get("host")}/verify/${qrId}`; // Changed to dynamic verification route
      const qrCode = await generateQrCode(qrUrl);

      const filename = `qr-${qrId}.pdf`;
      const fileUrl = `${req.protocol}://${req.get(
        "host"
      )}/qrcodes/${filename}`;
      const templateFile =
        templateType === "qr-only" ? "qr_only_template.ejs" : "template.ejs";

      const html = await ejs.renderFile(
        path.join(__dirname, "../views", templateFile),
        { qrCode }
      );

      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      const filePath = path.join(__dirname, "../public/qrcodes", filename);
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

    const qrDocs = await QRDocument.find({ status: "not_uploaded" }).limit(
      files.length
    );

    if (qrDocs.length < files.length) {
      return res
        .status(400)
        .json({ message: "More files than available QR IDs" });
    }

    const updatedDocs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const doc = qrDocs[i];

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;

      doc.uploadedFileUrl = fileUrl;
      doc.status = "uploaded";
      await doc.save();

      updatedDocs.push({ qrId: doc.qrId, fileUrl });
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

// 5. Redirect for external scanner
exports.verifyQrDocument = async (req, res) => {
  const { qrId } = req.params;

  try {
    const qrDoc = await QRDocument.findOne({ qrId });

    if (!qrDoc || !qrDoc.uploadedFileUrl) {
      return res.status(404).send("Document not found or not uploaded yet.");
    }

    res.redirect(qrDoc.uploadedFileUrl);
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).send("Internal server error.");
  }
};
exports.mergePdfFiles = async (req, res) => {
  const { files } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ message: "No PDF URLs provided." });
  }

  try {
    // Dynamically import pdf-merger-js (ES Module)
    const { default: PDFMerger } = await import("pdf-merger-js");
    const merger = new PDFMerger();

    for (const url of files) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
      const buffer = await response.buffer();
      const tempFilePath = `temp-${Date.now()}-${Math.random()}.pdf`;
      fs.writeFileSync(tempFilePath, buffer);
      await merger.add(tempFilePath);
      fs.unlinkSync(tempFilePath); // clean up
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

