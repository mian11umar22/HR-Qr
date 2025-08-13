const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hr-pages", // Optional: Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "docx"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
