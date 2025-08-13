const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const exec = promisify(execFile);
const { loadImage, createCanvas } = require("@napi-rs/canvas");
const jsQR = require("jsqr");

const log = (msg) => console.log("🔹", msg);

const convertPDFToImage = async (pdfPath) => {
  const dir = path.dirname(pdfPath);
  const base = path.basename(pdfPath, ".pdf");
  const outputPath = path.join(dir, `${base}_page1`);
  await exec("pdftocairo", [
    "-jpeg",
    "-singlefile",
    "-f",
    "1",
    "-l",
    "1",
    "-r",
    "96", // ✅ Bump DPI for better accuracy
    pdfPath,
    outputPath,
  ]);
  return `${outputPath}.jpg`;
};

const checkQRWithJsQR = async (filePath) => {
  try {
    const img = await loadImage(filePath);
    const targetWidth = Math.floor(img.width / 2);
    const targetHeight = Math.floor(img.height / 2);

    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (!code) return null;

    const rawData = code.data;
    // Extract qrId from rawData (accept URLs or plain IDs)
    const match = rawData.match(/\/qr\/(\w+)/);
    const qrId = match ? match[1] : rawData;

    return { qrId, rawData };
  } catch (err) {
    console.error("❌ jsQR failed:", err);
    return null;
  }
};

const checkQR = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  let imagePath = null;

  try {
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      imagePath = filePath;
    } else if (ext === ".pdf") {
      imagePath = await convertPDFToImage(filePath);
    } else {
      log("❌ Unsupported file type: " + ext);
      return null;
    }

    const qrData = await checkQRWithJsQR(imagePath);

    if (ext === ".pdf" && imagePath) {
      fs.unlink(imagePath).catch(() => {});
    }

    return qrData; // ✅ Always returns { qrId, rawData } or null
  } catch (err) {
    console.error("❌ QR scan failed:", err);
    return null;
  }
};

module.exports = checkQR;
