const express = require("express");
const app = express();
const router = express.Router();
const upload = require("../Middleware/multer");
const qrDocumentController = require("../Controller/qrDocumentController");
router.post("/qrDocument", qrDocumentController.generateQrDocuments);
router.post(
  "/upload-scanned",
  upload.array("scannedFiles", 10),
  qrDocumentController.uploadScannedDocuments
);
router.get("/verify/:qrId", qrDocumentController.verifyQrDocument);

router.post(
  "/qr/upload",
  upload.single("file"),
  qrDocumentController.uploadAndScanQr
);
module.exports = router;
