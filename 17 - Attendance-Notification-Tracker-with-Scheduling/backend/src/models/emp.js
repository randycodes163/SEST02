const mongoose = require("mongoose");

const db = mongoose.connection.useDb("attendance_db");

const employeeSchema = new mongoose.Schema({
  empID: { type: Number, required: true, unique: true },
  empName: { type: String, required: true },
  photo: { type: String }, // Optional photo field (stores file path or URL)
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }, // ✅ Fix: Add reference to schedule
});

const Emp = db.model("Employee", employeeSchema);

module.exports = Emp;
