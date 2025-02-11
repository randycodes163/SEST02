const express = require("express");
const router = express.Router();
const {
  addWeeklySchedule,
  getEmployeeSchedule,
  getAllSchedules,
  deleteSchedule,
  updateSchedule,
} = require("../controllers/scheduleController");

// POST: Add weekly schedule for an employee
router.post("/weekly", addWeeklySchedule); // Use this route for adding weekly schedules

// GET: Get all schedules
router.get("/", getAllSchedules); // Use this route to fetch all schedules

// GET: Get a specific employee's schedule by empID
router.get("/:id", getEmployeeSchedule); // Use this route to fetch a specific employee's schedule by ID

// DELETE: Delete a specific schedule by scheduleId
router.delete("/:scheduleId", deleteSchedule); // Use this route to delete a schedule by ID

// PUT: Update a specific schedule by scheduleId
router.put("/:scheduleId", updateSchedule); // Use this route to update a schedule by ID

module.exports = router;
