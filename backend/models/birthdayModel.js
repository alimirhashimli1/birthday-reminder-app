const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const birthdaySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
    },
    birthdate: {
      type: Date,
      required: true,
      trim: true,
    },
    note: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Birthday", birthdaySchema);
