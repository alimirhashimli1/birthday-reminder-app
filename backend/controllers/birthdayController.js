const Birthday = require("../models/birthdayModel");
const mongoose = require("mongoose");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

// Create a new instance of Storage
const storage = new Storage({
  projectId: "vivid-tuner-415422",
  keyFilename: "../mykey.json",
});

// name of the bucket where you want to store the images
const bucketName = storage.bucket("cakedaybuddyimages");

// set up multer for file upload
const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: bucketName,
    projectId: "vivid-tuner-415422",
    keyFilename: "../mykey.json",
    fileName: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

// get all birthdays
const getBirthdays = async (req, res) => {
  const birthdays = await Birthday.find({}).sort({ createdAt: -1 });

  res.status(200).json(birthdays);
};

// get a single birthday
const getBirthday = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such birthday" });
  }

  const birthday = await Birthday.findById(id);

  if (!birthday) {
    return res.status(404).json({ error: "No such birthday" });
  }

  res.status(200).json(birthday);
};

// create a birthday
const createBirthday = async (req, res) => {
  const { name, surname, birthdate, note } = req.body;

  // Upload picture to Google Cloud Storage
  let pictureUrl = "";
  if (req.file) {
    try {
      const file = req.file;
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });
      blobStream.on("finish", () => {
        pictureUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      });
      blobStream.end(file.buffer);
    } catch (error) {
      return res.status(500).json({ error: "Error uploading picture" });
    }
  }

  // Add birthday to database
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
};

// delete a birthday
const deleteBirthday = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json("No such birthday");
  }

  const birthday = await Birthday.findOneAndDelete({ _id: id });

  if (!birthday) {
    return res.status(404).json({ error: "No such birthday" });
  }

  res.status(200).json(birthday);
};

// edit a birthday
const updateBirthday = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json("No such birthday");
  }

  const birthday = await Birthday.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!birthday) {
    return res.status(404).json({ error: "No such workout" });
  }

  res.status(200).json(birthday);
};

module.exports = {
  createBirthday,
  getBirthday,
  getBirthdays,
  deleteBirthday,
  updateBirthday,
};
