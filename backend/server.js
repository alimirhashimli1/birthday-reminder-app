require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const birthdayRoutes = require("./routes/birthdays");
const { Storage } = require("@google-cloud/storage");
const multerGoogleStorage = require("multer-google-storage");

//express
const app = express();

// Multer-Google-Storage configuration
const storage = new Storage({
  projectId: "vivid-tuner-415422",
  keyFilename: "./vivid-tuner-415422-37337cede4bc.json",
});

const bucket = storage.bucket("cakedaybuddyimages");

const googleStorageUpload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: "cakedaybuddyimages",
    projectId: "vivid-tuner-415422",
    keyFilename: "./vivid-tuner-415422-37337cede4bc.json",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

// // Multer configuration for file upload
// const uploadDirectory = path.join(__dirname, "uploads");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDirectory);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: googleStorageUpload });

// middleware
// app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  // console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/birthdays", birthdayRoutes);

// Upload endpoint
// Upload endpoint
app.post("/api/upload", googleStorageUpload.single("file"), (req, res) => {
  // Handle file upload here
  console.dir(req.file); // Log the req.file object
  const filename = req.file.filename;
  const fileUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
  // console.log("fileUrl:", fileUrl); // Log the file URL
  res.json({ filename, url: fileUrl });
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
    console.log("This is an error", error);
  });
