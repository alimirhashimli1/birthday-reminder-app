const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

// Set up Google Cloud Storage
const storage = new Storage({
  keyFilename: "./vivid-tuner-415422-37337cede4bc.json",
  projectId: "vivid-tuner-415422",
});
const bucketName = "cakedaybuddyimages";
const bucket = storage.bucket(bucketName);

// Set up Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// Define MongoDB models
const User = require("../model/User"); // Define User schema and model

// POST route to handle file upload
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Upload file to Google Cloud Storage
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();
    blobStream.end(req.file.buffer);

    // Get uploaded file URL
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

    // Save user data to MongoDB
    const { name, surname } = req.body;
    const user = new User({
      name,
      surname,
      imageUrl,
    });
    await user.save();

    return res
      .status(201)
      .json({ message: "File uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
