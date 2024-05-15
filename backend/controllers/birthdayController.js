const Birthday = require("../models/birthdayModel");
const mongoose = require("mongoose");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const uuid = require("uuid"); // Import the UUID library

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
      const uniqueFilename = `${uuid.v4()}-${req.file.originalname}`;
      const blob = bucket.file(uniqueFilename);
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


  // Ensure that the picture is a string
  const updateBirthday = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json("No such birthday");
    }
  
    try {
      let picture = req.body.picture; // Existing picture URL
  
      // Check if a new file is uploaded
      if (req.file) {
        const uniqueFilename = `${uuid.v4()}-${req.file.originalname}`;
        const blob = bucket.file(uniqueFilename);
        const blobStream = blob.createWriteStream();
        blobStream.end(req.file.buffer);
  
        await new Promise((resolve, reject) => {
          blobStream.on("finish", () => {
            picture = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            resolve();
          });
  
          blobStream.on("error", (err) => {
            console.error("Error uploading file to Google Cloud Storage:", err);
            reject(err);
          });
        });
      }
  
      const { name, surname, note, birthdate } = req.body;
  
      // Construct updatedFields object
      const updatedFields = {
        name,
        surname,
        note,
        birthdate,
        picture, // Updated picture URL
      };
  
      // Update the birthday document
      const updatedBirthday = await Birthday.findOneAndUpdate(
        { _id: id },
        updatedFields,
        { new: true } // to return the updated document
      );
  
      if (!updatedBirthday) {
        return res.status(404).json({ error: "No such birthday" });
      }
  
      return res.status(200).json(updatedBirthday);
    } catch (error) {
      console.error("Error updating birthday:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
 // Handle image uploads
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uniqueFilename = `${uuid.v4()}-${req.file.originalname}`;
    const blob = bucket.file(uniqueFilename);
    const blobStream = blob.createWriteStream();
    blobStream.end(req.file.buffer);

    blobStream.on("finish", () => {
      const picture = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.status(201).json({ picture });
    });

    blobStream.on("error", (err) => {
      console.error("Error uploading file to Google Cloud Storage:", err);
      return res.status(500).json({ message: "Internal server error" });
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
  
  

module.exports = {
  createBirthday,
  getBirthday,
  getBirthdays,
  deleteBirthday,
  updateBirthday,
  uploadImage
};
