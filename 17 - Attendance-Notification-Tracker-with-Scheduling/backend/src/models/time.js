const mongoose = require("mongoose");

const timeSchema = new mongoose.Schema({
  empID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  timeIn: {
    type: Date,
    default: null,
  },
  timeOut: {
    type: Date,
    default: null,
  },
});

const Time = mongoose.model("Time", timeSchema);
module.exports = Time;
