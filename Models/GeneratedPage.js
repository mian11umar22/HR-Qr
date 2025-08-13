// Models/GeneratedPage.js
const mongoose = require("mongoose");

// Child schema for a single uploaded copy
const UploadedCopySchema = new mongoose.Schema(
  {
    fileName: { type: String },
    fileUrl: { type: String },
    // store **lowercase hex string** hashes; index helps duplicate lookups
    hash: { type: String, required: true, index: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Main schema for a QR record
const GeneratedPageSchema = new mongoose.Schema(
  {
    // Make qrId **unique** so you never get two docs for the same QR
    qrId: { type: String, required: true, index: true, unique: true },

    templateName: { type: String },
    fileUrl: { type: String },

    uploadedCopies: { type: [UploadedCopySchema], default: [] },
    pendingDuplicates: { type: Array, default: [] },

    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false, // keep your existing uploadedAt behavior; set true if you want createdAt/updatedAt
    versionKey: false, // keeps __v; set false to remove
  }
);

 
module.exports = mongoose.model("GeneratedPage", GeneratedPageSchema);
