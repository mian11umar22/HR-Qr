const mongoose = require("mongoose");

const qrDocumentSchema = new mongoose.Schema({
  qrId: {
    type: String,
    required: true,
    unique: true,
  },
  templateName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["not_uploaded", "uploaded"],
    default: "not_uploaded",
  },
  uploadedFileUrl: {
    type: String,
    default: null,
  }
});

module.exports = mongoose.model("QRDocument", qrDocumentSchema);
