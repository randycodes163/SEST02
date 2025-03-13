const express = require("express");
const router = express.Router();
const {
  addWeeklySchedule,
  getEmployeeSchedule,
  getAllSchedules,
  deleteSchedule,
  updateSchedule,
} = require("../controllers/scheduleController");

// Add new schedule
router.post("/", addWeeklySchedule);

// Get all schedules
router.get("/", getAllSchedules);

// Get a specific employee's schedule
router.get("/:id", getEmployeeSchedule);

// Update a schedule
router.put("/:scheduleId", updateSchedule);

// Delete a schedule
router.delete("/:scheduleId", deleteSchedule);

module.exports = router;
