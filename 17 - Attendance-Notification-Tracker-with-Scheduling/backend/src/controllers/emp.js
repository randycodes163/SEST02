const Emp = require("../models/emp");

// POST: This part is for creating a new Employee
// /data
const createEmployee = async (request, response) => {
  const { empID, empName, status, remarks } = request.body;

  try {
    const emp = await Emp.create({
      empID,
      empName,
      status,
      remarks,
    });

    response.status(201).json(emp);  // Status 201 for resource creation
  } catch (error) {
    response.status(400).json({ error: error.message });  // Bad request status for errors
  }
};

// Display all employees
const getAllEmployee = async (request, response) => {
  try {
    const emp = await Emp.find();  // Fetch all employees
    response.status(200).json(emp);  // OK status for successful fetch
  } catch (error) {
    response.status(400).json({ error: error.message });  // Error handling
  }
};

const deleteEmployee = async (request, response) => {
  const { id } = request.params;

  try {
    const emp = await Emp.findByIdAndDelete(id);  // Directly passing the id, not an object

    if (!emp) return response.status(404).json({ error: "No result!" });

    response.status(200).json({ message: "Successfully Deleted!" });  // Successfully deleted
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// Get: Get a specific employee using its ID.
const getEmployee = async (request, response) => {
  const { id } = request.params;

  try {
    const emp = await Emp.findById(id);  // Pass the id directly to findById

    if (!emp) return response.status(404).json({ error: "No result!" });

    response.status(200).json(emp);  // Successfully retrieved employee
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// PUT FOR UPDATE
const updateEmployee = async (request, response) => {
  const { id } = request.params;

  try {
    const emp = await Emp.findByIdAndUpdate(
      id,  // Passing id directly here
      { ...request.body },  // Spread request body to update employee data
      { new: true, runValidators: true }  // `new` returns the updated document, `runValidators` ensures validation is checked
    );

    if (!emp) return response.status(404).json({ error: "No result!" });

    response.status(202).json({  // Using status code 202 (Accepted) for successful updates
      message: "Successfully Updated!",
      emp,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });  // Handle errors
  }
};

module.exports = {
  createEmployee,
  getAllEmployee,
  deleteEmployee,
  getEmployee,
  updateEmployee,
};
