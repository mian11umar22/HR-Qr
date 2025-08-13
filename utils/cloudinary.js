// utils/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const streamifier = require("streamifier");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file or buffer to Cloudinary.
 * @param {string|Buffer} file - Path to file or Buffer data
 * @param {string} folder - Optional folder in Cloudinary
 * @param {boolean} removeLocal - Whether to delete local file after upload
 */
const uploadOnCloudinary = async (
  file,
  folder = "qr_uploads",
  removeLocal = true
) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      access_mode: "public",
    };

    const handleResult = (err, result) => {
      if (err) {
        console.error("❌ Cloudinary upload error:", err);
        if (typeof file === "string" && removeLocal && fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
        return reject(err);
      }
      if (typeof file === "string" && removeLocal && fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
      resolve(result);
    };

    // Upload from Buffer
    if (Buffer.isBuffer(file)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        handleResult
      );
      streamifier.createReadStream(file).pipe(uploadStream);
    }
    // Upload from local file path
    else if (typeof file === "string") {
      cloudinary.uploader.upload(file, options).then(
        (result) => handleResult(null, result),
        (err) => handleResult(err)
      );
    } else {
      reject(new Error("Invalid file type: must be path or Buffer"));
    }
  });
};

module.exports = uploadOnCloudinary;
