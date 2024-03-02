const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const mongoose = require("mongoose");

const app = express();
const upload = multer({ dest: "uploads/" });
const storage = new Storage();
const bucket = storage.bucket("your-bucket-name");
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schema = new mongoose.Schema({
  name: String,
  surname: String,
  imageUrl: String,
});

const Model = mongoose.model("Model", schema);

app.post("/submit", upload.single("image"), async (req, res) => {
  try {
    const { name, surname } = req.body;
    const image = req.file;
    const imageUrl = await uploadImage(image);
    await saveToDatabase(name, surname, imageUrl);
    res.status(200).send("Form submitted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

async function uploadImage(image) {
  const fileName = `${Date.now()}-${image.originalname}`;
  const file = bucket.file(fileName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: image.mimetype,
    },
  });
  return new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.on("finish", () => {
      const imageUrl = `https://storage.googleapis.com/your-bucket-name/${fileName}`;
      resolve(imageUrl);
    });
    stream.end(image.buffer);
  });
}

async function saveToDatabase(name, surname, imageUrl) {
  const data = new Model({ name, surname, imageUrl });
  await data.save();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
