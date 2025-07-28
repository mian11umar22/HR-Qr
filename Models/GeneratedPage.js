// models/generatedPage.js
const mongoose = require("mongoose");

const generatedPageSchema = new mongoose.Schema({
  qrId: { type: String, required: true }, // not unique
  fileHash: { type: String, required: true }, // hash of file content
  fileUrl: { type: String, required: true }, // first file’s URL (optional if not needed)
  uploadedAt: { type: Date, default: Date.now },
  uploadedCopies: [
    {
      fileName: String,
      fileUrl: String, // ✅ Add this line
      hash: String,
      uploadedAt: Date,
    },
  ],
});

module.exports = mongoose.model("GeneratedPage", generatedPageSchema);
