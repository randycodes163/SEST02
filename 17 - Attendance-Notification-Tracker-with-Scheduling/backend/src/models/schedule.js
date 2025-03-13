const mongoose = require("mongoose");

const db = mongoose.connection.useDb("attendance_db");

const scheduleSchema = new mongoose.Schema({
  empID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // ✅ Fix: Use ObjectId
  week: { type: Date, required: true },
  days: [
    {
      day: { type: String, required: true },
      date: { type: String, required: true },
      isRestDay: { type: Boolean, required: true },
      scheduledStartTime: { type: String, default: null },
      scheduledEndTime: { type: String, default: null },
    },
  ],
});

const Schedule = db.model("Schedule", scheduleSchema);

module.exports = Schedule;
