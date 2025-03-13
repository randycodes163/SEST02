const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure multer storage (files will be stored in the "uploads" folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists at the project root
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp-originalfilename
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const {
  createEmployee,
  getAllEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployeesWithDetails,
} = require("../controllers/emp");

// POST: Create a new Employee (with multer to handle file upload for 'photo')
router.post("/", upload.single("photo"), createEmployee);

// GET: Retrieve all employees
router.get("/", getAllEmployee);

// GET: Retrieve all employees with their schedule & time records
router.get("/details", getAllEmployeesWithDetails);

// GET: Retrieve a specific employee by MongoDB _id
router.get("/:id", getEmployee);

// 🔹 PUT: Update an employee using MongoDB _id (Now supports file upload)
router.put("/:id", upload.single("photo"), updateEmployee);

// DELETE: Remove an employee by MongoDB _id
router.delete("/:id", deleteEmployee);

module.exports = router;
