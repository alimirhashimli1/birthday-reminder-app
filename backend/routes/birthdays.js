const express = require("express");

const router = express.Router();
const {
  createBirthday,
  getBirthday,
  getBirthdays,
  deleteBirthday,
  updateBirthday,
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

module.exports = router;
