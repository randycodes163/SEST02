const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  empID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",  // Link to the Employee model
    required: true,
  },
  week: {
    type: String,  // e.g., "Week 1", "Week 2"
    required: true,
  },
  days: [
    {
      day: { type: String, required: true },  // e.g., "Monday"
      scheduledStart: { type: Date }, // Scheduled work start time (9 AM)
      scheduledEnd: { type: Date },   // Scheduled work end time (6 PM)
      timeIn: { type: Date },  // Employee's time-in
      timeOut: { type: Date }, // Employee's time-out
      isRestDay: { type: Boolean, default: false },  // Whether this day is a rest day
      isAbsent: { type: Boolean, default: false }, // Whether the employee didn't clock in
      tardiness: { type: Number, default: 0 },  // Number of minutes late
    },
  ],
});

// Create the model using the schema
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
