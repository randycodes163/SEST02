// routes/emp.js
const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployee,
  deleteEmployee,
  getEmployee,
  updateEmployee,
} = require("../controllers/emp");

// POST: Create a new Employee
router.post("/", createEmployee);

// GET: Retrieve all employees
router.get("/", getAllEmployee);

// DELETE: Remove an employee by ID
router.delete("/:id", deleteEmployee);

// GET: Retrieve a specific employee by ID
router.get("/:id", getEmployee);

// PUT: Update an employee by ID
router.put("/:id", updateEmployee);

module.exports = router;
