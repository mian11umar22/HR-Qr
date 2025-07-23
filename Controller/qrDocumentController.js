const QRDocument = require("../Models/QRDocument");
const generateQrCode = require("../utils/generateQr");
const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");
const { checkQRInPDF, checkQRInImage } = require("../utils/qrScanner");

const BASE_URL = "https://hr-qr-production.up.railway.app";

exports.uploadAndScanQr = async (req, res) => {
  try {
    const file = req.file;
    const ref_id = req.body.ref_id;
    const fileType = file.mimetype;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `${BASE_URL}/uploads/${file.filename}`;

    const doc = new QRDocument({
      filename: file.originalname,
      path: file.path,
      url: fileUrl,
      ref_id,
    });

    if (fileType === "application/pdf") {
      const result = await checkQRInPDF(file.path);

      doc.qr_code_found = result.qrFound;
      doc.qr_code_data = result.qrData;
      await doc.save();

      return res.status(200).json({
        message: result.qrFound ? "QR Code found" : "QR Code not found",
        qrFound: result.qrFound,
        qrData: result.qrData,
        fileUrl,
        docId: doc._id,
      });
    } else if (fileType.startsWith("image/")) {
      const result = await checkQRInImage(file.path);

      doc.qr_code_found = result.qrFound;
      doc.qr_code_data = result.qrData;
      await doc.save();

      return res.status(200).json({
        message: result.qrFound ? "QR Code found" : "QR Code not found",
        qrFound: result.qrFound,
        qrData: result.qrData,
        fileUrl,
        docId: doc._id,
      });
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }
  } catch (err) {
    console.error("Error in uploadAndScanQr:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.generatePdfWithQR = async (req, res) => {
  try {
    const { docId, qrData } = req.body;
    const document = await QRDocument.findById(docId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filename = `${Date.now()}-merged-qr-documents (6).pdf`;
    const outputPath = path.join(__dirname, "../public/qrcodes", filename);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(`
      <html>
        <body>
          <div style="padding: 20px;">
            <h2>QR Document</h2>
            <p><strong>QR Data:</strong> ${qrData}</p>
            <img src="${await generateQrCode(qrData)}" />
          </div>
        </body>
      </html>
    `);

    await page.pdf({ path: outputPath, format: "A4" });
    await browser.close();

    const fileUrl = `${BASE_URL}/qrcodes/${filename}`;

    document.generated_qr_pdf = outputPath;
    document.generated_qr_pdf_url = fileUrl;
    document.qr_code_found = true;
    document.qr_code_data = qrData;
    await document.save();

    return res.status(200).json({
      message: "PDF generated successfully",
      fileUrl,
    });
  } catch (error) {
    console.error("Error in generatePdfWithQR:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

exports.uploadDocxAndConvertToPdf = async (req, res) => {
  try {
    const file = req.file;
    const ext = ".pdf";
    const outputPath = path.join(
      __dirname,
      "../public/uploads",
      `${uuidv4()}-converted.pdf`
    );

    const fileBuffer = fs.readFileSync(file.path);
    libre.convert(fileBuffer, ext, undefined, async (err, done) => {
      if (err) {
        console.error("Error converting file:", err);
        return res.status(500).json({ error: "File conversion failed" });
      }

      fs.writeFileSync(outputPath, done);

      const fileUrl = `${BASE_URL}/uploads/${path.basename(outputPath)}`;

      const doc = new QRDocument({
        filename: file.originalname,
        path: outputPath,
        url: fileUrl,
        ref_id: req.body.ref_id,
      });

      await doc.save();

      res.status(200).json({
        message: "File converted to PDF successfully",
        fileUrl,
        docId: doc._id,
      });
    });
  } catch (error) {
    console.error("Error in uploadDocxAndConvertToPdf:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
