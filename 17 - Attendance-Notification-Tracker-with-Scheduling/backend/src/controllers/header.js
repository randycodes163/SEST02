// src/controllers/header.js
const Header = require("../models/header");
const fs = require("fs");
const path = require("path");

// GET: Retrieve the current header photo from the database.
const getHeader = async (req, res) => {
  try {
    const header = await Header.findOne();
    if (!header) {
      // Return a default value if no header exists.
      return res.status(200).json({ photo: "uploads/default-header.jpg" });
    }
    res.status(200).json({ photo: header.photo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST/PUT: Update the header photo using file upload.
const updateHeader = async (req, res) => {
  if (req.file) {
    try {
      // Optionally, remove the old header file if needed.
      const header = await Header.findOne();
      if (header && header.photo !== "uploads/default-header.jpg") {
        fs.unlink(path.join(__dirname, "../../", header.photo), (err) => {
          if (err) console.error("Error deleting old header:", err);
        });
      }
      const newPhotoPath = req.file.path;
      const headerData = await Header.findOneAndUpdate(
        {},
        { photo: newPhotoPath },
        { new: true, upsert: true } // upsert creates a new document if none exists
      );
      res.status(200).json({ message: "Header updated", photo: headerData.photo });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
};

// DELETE: Remove the header photo (reset to default).
const deleteHeader = async (req, res) => {
  try {
    // Optionally remove the existing file if it's not the default.
    const header = await Header.findOne();
    if (header && header.photo !== "uploads/default-header.jpg") {
      fs.unlink(path.join(__dirname, "../../", header.photo), (err) => {
        if (err) console.error("Error deleting header:", err);
      });
    }
    // Reset header to default
    const headerData = await Header.findOneAndUpdate(
      {},
      { photo: "uploads/default-header.jpg" },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Header removed", photo: headerData.photo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getHeader, updateHeader, deleteHeader };
