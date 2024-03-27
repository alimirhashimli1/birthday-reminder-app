const Birthday = require("../models/birthdayModel");
const mongoose = require("mongoose");
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
}).single("picture");

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
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error Uploading file:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.end(req.file.buffer);

      blobStream.on("finish", async () => {
        const picture = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        const { name, surname, birthdate, note } = req.body;

        const birthday = await Birthday.create({
          name,
          surname,
          birthdate,
          note,
          picture,
        });
        await birthday.save();

        return res
          .status(201)
          .json({ message: "File uploaded successfully", picture });
      });

      blobStream.on("error", (err) => {
        console.error("Error uploading file to Google Cloud Storage:", err);
        return res.status(500).json({ message: "Internal server error" });
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
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
