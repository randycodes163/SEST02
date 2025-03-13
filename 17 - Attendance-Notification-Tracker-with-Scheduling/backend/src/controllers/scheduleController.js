const Schedule = require("../models/schedule");
const Employee = require("../models/emp");

// Function to get the start of the week (Monday)
const getStartOfWeek = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to get Monday
  return new Date(date.setDate(diff));
};

// POST: Add weekly schedule for an employee
const addWeeklySchedule = async (req, res) => {
  const { empID, week, restDays, scheduledStartTime, scheduledEndTime } = req.body;

  if (restDays.length !== 2) {
    return res.status(400).json({ error: "You must specify exactly two rest days." });
  }

  if (!scheduledStartTime || !scheduledEndTime) {
    return res.status(400).json({ error: "Both start and end times must be provided." });
  }

  try {
    const employee = await Employee.findOne({ empID });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const existingSchedule = await Schedule.findOne({ empID: employee._id, week });
    if (existingSchedule) {
      return res.status(400).json({ error: "Schedule already exists for this week" });
    }

    const startOfWeek = getStartOfWeek(week);
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const scheduleDays = allDays.map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);
      return {
        day,
        date: currentDate.toISOString().split('T')[0],
        isRestDay: restDays.includes(day),
        scheduledStartTime: restDays.includes(day) ? null : scheduledStartTime,
        scheduledEndTime: restDays.includes(day) ? null : scheduledEndTime,
      };
    });

    const schedule = new Schedule({
      empID: employee._id,
      week,
      days: scheduleDays,
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve schedule by employee Workday ID
const getEmployeeSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findOne({ empID: id });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const schedule = await Schedule.findOne({ empID: employee._id });
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve all schedules
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("empID", "empName empID");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE: Remove a schedule by its ID
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT: Update an employee's schedule
const updateSchedule = async (req, res) => {
  const { restDays, scheduledStartTime, scheduledEndTime } = req.body;

  try {
    const schedule = await Schedule.findById(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    schedule.days = schedule.days.map((day) => {
      if (restDays.includes(day.day)) {
        day.isRestDay = true;
        day.scheduledStartTime = null;
        day.scheduledEndTime = null;
      } else {
        day.isRestDay = false;
        day.scheduledStartTime = scheduledStartTime;
        day.scheduledEndTime = scheduledEndTime;
      }
      return day;
    });

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
