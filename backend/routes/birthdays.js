const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  createBirthday,
  getBirthday,
  getBirthdays,
  deleteBirthday,
  updateBirthday,
} = require("../controllers/birthdayController");

// Multer configuration for file upload
const upload = multer({ dest: "uploads/" }); // Adjust the destination directory as needed

// Get all birthdays
router.get("/", getBirthdays);

// get a single birthday
router.get("/:id", getBirthday);

// post a new birthday
router.post("/", upload.single("file"), createBirthday);

// delete a birthday
router.delete("/:id", deleteBirthday);

// edit a birthday
router.patch("/:id", updateBirthday);

module.exports = router;
