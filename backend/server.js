require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const birthdayRoutes = require("./routes/birthdays");

//express
const app = express();

// Multer configuration for file upload
const uploadDirectory = path.join(__dirname, "uploads");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// middleware
// app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/birthdays", birthdayRoutes);

// Upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  // Handle file upload here
  res.json({ filename: req.file.filename });
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen port number
    app.listen(process.env.PORT, () => {
      console.log(
        `connected to the db & listening on port ${process.env.PORT}!!`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
