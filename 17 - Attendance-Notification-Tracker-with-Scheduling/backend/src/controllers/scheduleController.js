const Schedule = require("../models/schedule");
const Emp = require("../models/emp");

// Function to get the start of the week (Monday)
const getStartOfWeek = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to get Monday
  return new Date(date.setDate(diff));
};

// POST: Add weekly schedule (for the entire week)
const addWeeklySchedule = async (req, res) => {
  const { empID, week, restDays, scheduledStartTime, scheduledEndTime } = req.body;

  // Validate restDays (should be exactly two rest days)
  if (restDays.length !== 2) {
    return res.status(400).json({ error: "You must specify exactly two rest days." });
  }

  // Validate that both scheduledStartTime and scheduledEndTime are provided
  if (!scheduledStartTime || !scheduledEndTime) {
    return res.status(400).json({ error: "Both scheduled start time and scheduled end time must be provided." });
  }

  try {
    // Check if employee exists
    const employee = await Emp.findById(empID);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Check if a schedule already exists for the same employee and week
    const existingSchedule = await Schedule.findOne({ empID, week });
    if (existingSchedule) {
      return res.status(400).json({ error: "Schedule already exists for this employee in the given week" });
    }

    // Get the start of the week (Monday)
    const startOfWeek = getStartOfWeek(week);
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Generate the schedule for the whole week with date, day, and time
    const scheduleDays = allDays.map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index); // Set the date to the corresponding day of the week

      const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date (YYYY-MM-DD)

      return {
        day: day,
        date: formattedDate, // Add the date
        isRestDay: restDays.includes(day),
        scheduledStartTime: restDays.includes(day) ? null : scheduledStartTime,
        scheduledEndTime: restDays.includes(day) ? null : scheduledEndTime,
      };
    });

    // Create the schedule object
    const schedule = new Schedule({
      empID,
      week,
      days: scheduleDays,
    });

    // Save the schedule to the database
    await schedule.save();
    res.status(201).json(schedule); // Return the newly created schedule
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve a specific employee schedule by ID
const getEmployeeSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findOne({ empID: id });  // Find the schedule by empID

    if (!schedule) return res.status(404).json({ error: "Schedule not found for this employee" });

    res.status(200).json(schedule); // Return the schedule of the employee
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve all schedules
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();  // Fetch all schedules
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE: Delete a specific schedule by ID
const deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;

  try {
    const schedule = await Schedule.findByIdAndDelete(scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT: Update an employee's schedule
const updateSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const { restDays, scheduledStartTime, scheduledEndTime } = req.body;

  try {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    // Update the rest days and scheduled times
    schedule.days = schedule.days.map((day) => {
      // If the day is a rest day, update it accordingly
      if (restDays && restDays.includes(day.day)) {
        day.isRestDay = true;
        day.scheduledStartTime = null;
        day.scheduledEndTime = null;
      } else {
        // Otherwise, update the scheduled times
        day.isRestDay = false;
        day.scheduledStartTime = scheduledStartTime;
        day.scheduledEndTime = scheduledEndTime;
      }
      return day;
    });

    // Save the updated schedule
    await schedule.save();
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addWeeklySchedule,
  getEmployeeSchedule,
  getAllSchedules,
  deleteSchedule,
  updateSchedule,
};
