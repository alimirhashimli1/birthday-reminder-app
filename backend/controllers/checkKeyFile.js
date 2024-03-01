const fs = require("fs");

// Path to your service account key file
const keyFilePath = "../mykey.json";

// Attempt to read the file
fs.readFile(keyFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading key file:", err);
  } else {
    console.log("Key file contents:", data);
  }
});
