const express = require("express");
const router = express.Router();
const {
  timeIn,
  timeOut,
  updateTimeIn,
  updateTimeOut,
  deleteTime,
  getEmployeeTimeRecords,
} = require("../controllers/timeController");

// POST: Time In
router.post("/timeIn", timeIn);

// POST: Time Out
router.post("/timeOut", timeOut);

// PUT: Update Time In
router.put("/updateTimeIn", updateTimeIn);

// PUT: Update Time Out
router.put("/updateTimeOut", updateTimeOut);

// DELETE: Delete a time record
router.delete("/deleteTime", deleteTime);

// GET: Retrieve all time records for an employee by workday ID
router.get("/employee/:empID", getEmployeeTimeRecords);

module.exports = router;
