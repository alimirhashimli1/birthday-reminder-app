const express = require("express");
const multer = require("multer"); // Import multer

const upload = multer();

const router = express.Router();
const {
  createBirthday,
  getBirthday,
  getBirthdays,
  deleteBirthday,
  updateBirthday,
  uploadImage
} = require("../controllers/birthdayController");

// Get all birthdays
router.get("/", getBirthdays);

// get a single birthday
router.get("/:id", getBirthday);


// post a new birthday
router.post("/", createBirthday);

// delete a birthday
router.delete("/:id", deleteBirthday);

// edit a birthday
router.patch("/:id", updateBirthday);

router.post("/upload", upload.single("picture"), uploadImage);

module.exports = router;
