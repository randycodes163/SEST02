// models/time.js
const mongoose = require("mongoose");

// Get the specific database connection using `useDb`
const db = mongoose.connection.useDb("attendance_db");

// Define the schema for a time record
const timeSchema = new mongoose.Schema({
  empID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String, // We'll store the date as a string (e.g., "2025-02-11")
    required: true,
  },
  timeIn: {
    type: Date, // Store timeIn as a Date object
    required: false,  // Optional, can be updated later
  },
  timeOut: {
    type: Date, // Store timeOut as a Date object
    required: false, // Optional, can be updated later
  },
});

// Create the 'Time' model using the schema in the specific database
module.exports = db.model("Time", timeSchema);
