const express = require("express");
const router = express.Router();
const {
  addSchedule,
  timeIn,
  timeOut,
  getSchedule,
} = require("../controllers/scheduleController");

// POST: Add weekly schedule for employee (with rest days)
router.post("/", addSchedule);  // Ensure this matches your Postman request

// PUT: Time in for employee
router.put("/time-in", timeIn);

// PUT: Time out for employee
router.put("/time-out", timeOut);

// GET: Get schedule for employee for a particular week
router.get("/:empID/:week", getSchedule);

module.exports = router;
