const mongoose = require("mongoose");

// Define the schema for an employee
const employeeSchema = new mongoose.Schema({
  empID: { type: Number, required: true },
  empName: { type: String, required: true },
  status: { type: String, required: true },
  remarks: [{ body: { type: String } }],
});

// Create the 'Employee' model using the schema
const Emp = mongoose.model("Employee", employeeSchema);

// Export the model
module.exports = Emp;
