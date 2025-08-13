const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// const qrDocumentRoute = require("./Routes/qrDocumentRoute");
const generatepageroute = require("./Routes/GeneratedPageRoute");
app.use(cors());
// Environment config
dotenv.config();

// Middleware and view setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
 
app.use("/", generatepageroute);
 
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    setHeaders: function (res, filePath) {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline"); // 👈 Add this line
      }
    },
  })
);


mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Railway dynamic port handling
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server connected to port ${port}`);
});
