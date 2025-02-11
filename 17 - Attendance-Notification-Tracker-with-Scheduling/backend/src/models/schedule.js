// models/schedule.js
const mongoose = require("mongoose");

// Get the specific database connection using `useDb`
const db = mongoose.connection.useDb("attendance_db");

// Define the schema for a schedule
const scheduleSchema = new mongoose.Schema({
  empID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  week: { type: String, required: true }, // Stores the week (e.g., "2025-02-10")
  days: [
    {
      day: { type: String, required: true },
      date: { type: String, required: true }, // Add date field here
      isRestDay: { type: Boolean, required: true },
      scheduledStartTime: { type: String, default: null },
      scheduledEndTime: { type: String, default: null },
    },
  ],
});

// Create the 'Schedule' model using the schema in the specific database
const Schedule = db.model("Schedule", scheduleSchema);

module.exports = Schedule;
