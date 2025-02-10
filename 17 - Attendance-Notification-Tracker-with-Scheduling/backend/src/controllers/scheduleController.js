const Schedule = require("../models/schedule");
const Emp = require("../models/emp");

// POST: Add weekly schedule with 2 rest days
const addSchedule = async (req, res) => {
  const { empID, week, restDays } = req.body;

  // Validate restDays (it should contain exactly two rest days)
  if (restDays.length !== 2) {
    return res.status(400).json({ error: "You must specify exactly two rest days." });
  }

  try {
    // Check if employee exists
    const employee = await Emp.findById(empID);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Define days of the week
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    // Create the schedule days, marking two rest days and the remaining days as workdays
    const scheduleDays = allDays.map((day) => {
      return {
        day: day,
        isRestDay: restDays.includes(day),
        scheduledStart: restDays.includes(day) ? null : new Date(`2025-01-01T09:00:00`),  // 9 AM start for workdays
        scheduledEnd: restDays.includes(day) ? null : new Date(`2025-01-01T18:00:00`),    // 6 PM end for workdays
      };
    });

    // Create the schedule
    const schedule = new Schedule({
      empID,
      week,
      days: scheduleDays,
    });

    await schedule.save();
    res.status(201).json(schedule);  // Return created schedule
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT: Time in for employee
const timeIn = async (req, res) => {
  const { scheduleId, day, timeIn } = req.body;

  try {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    const daySchedule = schedule.days.find(d => d.day === day);
    if (!daySchedule) return res.status(404).json({ error: "Day not found" });
    if (daySchedule.isRestDay) return res.status(400).json({ error: "It's a rest day!" });

    // Record time-in
    daySchedule.timeIn = new Date(timeIn);

    // Calculate tardiness based on scheduled start time (9 AM)
    const scheduledStart = new Date(daySchedule.scheduledStart);
    const tardiness = (daySchedule.timeIn - scheduledStart) / (1000 * 60);  // Calculate minutes of lateness
    daySchedule.tardiness = tardiness > 0 ? tardiness : 0;

    await schedule.save();
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT: Time out for employee
const timeOut = async (req, res) => {
  const { scheduleId, day, timeOut } = req.body;

  try {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    const daySchedule = schedule.days.find(d => d.day === day);
    if (!daySchedule) return res.status(404).json({ error: "Day not found" });
    if (daySchedule.isRestDay) return res.status(400).json({ error: "It's a rest day!" });

    // Record time-out
    daySchedule.timeOut = new Date(timeOut);

    // If no time-in, mark as absent
    if (!daySchedule.timeIn) {
      daySchedule.isAbsent = true;
    }

    await schedule.save();
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Get schedule for employee for a particular week
const getSchedule = async (req, res) => {
  const { empID, week } = req.params;

  try {
    const schedule = await Schedule.findOne({ empID, week });
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addSchedule,
  timeIn,
  timeOut,
  getSchedule,
};