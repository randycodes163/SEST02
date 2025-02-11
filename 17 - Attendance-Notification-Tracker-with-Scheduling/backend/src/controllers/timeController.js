const Time = require("../models/time");
const Emp = require("../models/emp");
const Schedule = require("../models/schedule");
const moment = require("moment"); // Import moment.js for handling date manipulations

// Time In - POST /api/time/timeIn
const timeIn = async (req, res) => {
  const { empID, date, timeIn } = req.body;

  try {
    const employee = await Emp.findById(empID);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // Check if the day is a rest day
    const schedule = await Schedule.findOne({ empID });
    const restDay = schedule.days.find(d => d.date === date && d.isRestDay);
    if (restDay) return res.status(400).json({ error: "Cannot time-in on a rest day" });

    const existingTime = await Time.findOne({ empID, date });
    if (existingTime && existingTime.timeIn) {
      return res.status(400).json({ error: "Already timed in" });
    }

    // Manually set the timeIn (convert to Date)
    const newTimeIn = moment(`${date} ${timeIn}`, "YYYY-MM-DD HH:mm:ss").toDate();

    const newTime = new Time({
      empID,
      date,
      timeIn: newTimeIn,
    });

    await newTime.save();
    res.status(201).json({
      message: "Successfully time-in",
      empID,
      date,
      timeIn: newTime.timeIn,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Time Out - POST /api/time/timeOut
const timeOut = async (req, res) => {
  const { empID, date, timeOut } = req.body;

  try {
    const existingTime = await Time.findOne({ empID, date });
    if (!existingTime || !existingTime.timeIn) {
      return res.status(400).json({ error: "Cannot time-out without time-in" });
    }

    // Ensure that time-out has not been already recorded
    if (existingTime.timeOut) {
      return res.status(400).json({ error: "Already time-out" });
    }

    // Manually set the timeOut (convert to Date)
    const newTimeOut = moment(`${date} ${timeOut}`, "YYYY-MM-DD HH:mm:ss").toDate();

    existingTime.timeOut = newTimeOut;
    await existingTime.save();

    res.status(200).json({
      message: "Successfully time-out",
      empID,
      date,
      timeOut: existingTime.timeOut,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Time In - PUT /api/time/updateTimeIn
const updateTimeIn = async (req, res) => {
  const { empID, date, timeIn } = req.body;

  try {
    const existingTime = await Time.findOne({ empID, date });
    if (!existingTime) {
      return res.status(404).json({ error: "No time record found for this employee on the given date" });
    }

    // Manually update timeIn (convert to Date)
    existingTime.timeIn = moment(`${date} ${timeIn}`, "YYYY-MM-DD HH:mm:ss").toDate();
    await existingTime.save();

    res.status(200).json({
      message: "Successfully updated time-in",
      empID,
      date,
      timeIn: existingTime.timeIn,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Time Out - PUT /api/time/updateTimeOut
const updateTimeOut = async (req, res) => {
  const { empID, date, timeOut } = req.body;

  try {
    const existingTime = await Time.findOne({ empID, date });
    if (!existingTime || !existingTime.timeIn) {
      return res.status(404).json({ error: "No time-in record found for this employee on the given date" });
    }

    // Manually update timeOut (convert to Date)
    existingTime.timeOut = moment(`${date} ${timeOut}`, "YYYY-MM-DD HH:mm:ss").toDate();
    await existingTime.save();

    res.status(200).json({
      message: "Successfully updated time-out",
      empID,
      date,
      timeOut: existingTime.timeOut,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Time In/Time Out - DELETE /api/time/deleteTime
const deleteTime = async (req, res) => {
  const { empID, date } = req.body;

  try {
    const existingTime = await Time.findOne({ empID, date });
    if (!existingTime) {
      return res.status(404).json({ error: "No time records found" });
    }

    await Time.findOneAndDelete({ empID, date });
    res.status(200).json({ message: "Time In/Out deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Display All Time In/Out Records - GET /api/time/all
const getAllTimeRecords = async (req, res) => {
  try {
    const times = await Time.find().populate("empID", "empName empID");
    res.status(200).json(times);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  timeIn,
  timeOut,
  updateTimeIn,
  updateTimeOut,
  deleteTime,
  getAllTimeRecords,
};
