// models/emp.js
const mongoose = require("mongoose");

// Define the schema for an employee

const db = mongoose.connection.useDb("attendance_db");

const employeeSchema = new mongoose.Schema({
  empID: { type: Number, required: true },
  empName: { type: String, required: true },
  status: { type: String, required: true },
  remarks: [{ body: { type: String } }],
});

// Create the 'Employee' model using the schema

const Emp = db.model("Employee", employeeSchema);

module.exports = Emp;
