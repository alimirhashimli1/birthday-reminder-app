const Birthday = require("../models/birthdayModel");
const mongoose = require("mongoose");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

// Create a new instance of Storage
const storage = new Storage({
  projectId: "vivid-tuner-415422", // Replace with your Google Cloud project ID
  keyFilename: "../vivid-tuner-415422-37337cede4bc.json", // Path to your service account key file
});

// Name of the bucket where you want to store the images
const bucketName = "cakedaybuddyimages";

// Set up multer for file upload
const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: bucketName,
    projectId: "vivid-tuner-415422", // Replace with your Google Cloud project ID
    keyFilename: "../vivid-tuner-415422-37337cede4bc.json", // Path to your service account key file
    filename: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
}).single("file"); // Assuming you're uploading a single file with the field name "file"

// Get all birthdays
const getBirthdays = async (req, res) => {
  try {
    const birthdays = await Birthday.find({}).sort({ createdAt: -1 });
    res.status(200).json(birthdays);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single birthday
const getBirthday = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such birthday" });
    }
    const birthday = await Birthday.findById(id);
    if (!birthday) {
      return res.status(404).json({ error: "No such birthday" });
    }
    res.status(200).json(birthday);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a birthday
const createBirthday = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "Multer error" });
    } else if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    const { name, surname, birthdate, note } = req.body;
    const pictureUrl = req.file ? req.file.path : null; // Assuming multer saves the file path
    // console.log(pictureUrl);
    try {
      const birthday = await Birthday.create({
        name,
        surname,
        birthdate,
        note,
        picture: pictureUrl,
      });
      res.status(200).json(birthday);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Delete a birthday
const deleteBirthday = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json("No such birthday");
    }
    const birthday = await Birthday.findOneAndDelete({ _id: id });
    if (!birthday) {
      return res.status(404).json({ error: "No such birthday" });
    }
    res.status(200).json(birthday);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit a birthday
const updateBirthday = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json("No such birthday");
    }
    const birthday = await Birthday.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!birthday) {
      return res.status(404).json({ error: "No such birthday" });
    }
    res.status(200).json(birthday);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createBirthday,
  getBirthday,
  getBirthdays,
  deleteBirthday,
  updateBirthday,
};
