const express = require("express");
const Birthday = require("../models/birthdayModel");

const router = express.Router();

// Get all birthdays
router.get("/", (req, res) => {
  res.json({ msg: "GET all birthdays" });
});

// get a single birthday
router.get("/:id", (req, res) => {
  res.json({ msg: "GET a single birthday" });
});

// post a new birthday
router.post("/", async (req, res) => {
  const { name, surname, birthdate, note, picture } = req.body;

  try {
    const birthday = await Birthday.create({
      name,
      surname,
      birthdate,
      note,
      picture,
    });
    res.status(200).json(birthday);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete a birthday
router.delete("/:id", (req, res) => {
  res.json({ msg: "Delete  a birthday" });
});

// edit a birthday
router.patch("/:id", (req, res) => {
  res.json({ msg: "edit  a birthday" });
});

module.exports = router;
