const Birthday = require("../models/birthdayModel");
const mongoose = require("mongoose");

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
  const { name, surname, birthdate, note, picture } = req.body;

  // add doc to db
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
