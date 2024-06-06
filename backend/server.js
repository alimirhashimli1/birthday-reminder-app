require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose");
const birthdayRoutes = require("./routes/birthdays");
const userRoutes = require("./routes/user");

//express
const app = express();

// middleware
// app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// routes
app.use("/api/birthdays", birthdayRoutes);
app.use("/api/user", userRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen port number
    app.listen(process.env.PORT, () => {
      console.log(
        `connected to the db & listening on port ${process.env.PORT}!!`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
