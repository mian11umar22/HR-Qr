const express = require("express");
const app = express();
const router = express.Router();
const generatedPageController = require("../Controller/generatePagesController");
const upload = require("../Middleware/multer");
router.post("/qrDocument", generatedPageController.generatePages);
router.post(
  "/upload-hr-page",
  upload.array("scannedFiles"),
  generatedPageController.uploadHRPage
);
router.get("/qr/:qrId", generatedPageController.getUploadsByQrId);
router.post(
  "/replace-uploaded-file",
  upload.none(),
  generatedPageController.replaceUploadedFile
);
router.get("/stats",generatedPageController.Stats);
module.exports = router;
