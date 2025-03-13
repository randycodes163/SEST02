const Time = require("../models/time");
const Emp = require("../models/emp");
const Schedule = require("../models/schedule");
const moment = require("moment"); // Import moment.js for handling date manipulations

// Time In - POST /api/time/timeIn
const timeIn = async (req, res) => {
  const { empID } = req.body; // This is the workday ID provided

  try {
    // Find employee by workday ID (empID field)
    const employee = await Emp.findOne({ empID: empID });
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    const currentTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const currentDate = moment().format("YYYY-MM-DD");

    // Check if employee has a schedule (schedule references employee via employee._id)
    const schedule = await Schedule.findOne({ empID: employee._id });
    if (!schedule) {
      return res
        .status(400)
        .json({ error: "Cannot time-in: No schedule found for this employee" });
    }

    // Find today's schedule
    const todaySchedule = schedule.days.find((d) => d.date === currentDate);
    if (!todaySchedule) {
      return res
        .status(400)
        .json({ error: "Cannot time-in: No schedule set for today" });
    }

    // Check if it's a rest day
    if (todaySchedule.isRestDay) {
      return res.status(400).json({ error: "Cannot time-in on a rest day" });
    }

    // Check if already timed in
    const existingTime = await Time.findOne({ empID: employee._id, date: currentDate });
    if (existingTime && existingTime.timeIn) {
      return res.status(400).json({ error: "Already timed in" });
    }

    // Save new time-in record
    const newTime = new Time({
      empID: employee._id,
      date: currentDate,
      timeIn: moment(currentTimestamp, "YYYY-MM-DD HH:mm:ss").toDate(),
    });

    await newTime.save();
    res.status(201).json({
      message: "Successfully timed in",
      empID: employee.empID, // Return the workday ID as confirmation
      date: newTime.date,
      timeIn: newTime.timeIn,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Time Out - POST /api/time/timeOut
const timeOut = async (req, res) => {
  const { empID } = req.body; // Workday ID

  try {
    // Find employee by workday ID
    const employee = await Emp.findOne({ empID: empID });
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    const currentTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const currentDate = moment().format("YYYY-MM-DD");

    const existingTime = await Time.findOne({ empID: employee._id, date: currentDate });
    if (!existingTime || !existingTime.timeIn) {
      return res.status(400).json({ error: "Cannot time-out without time-in" });
    }

    if (existingTime.timeOut) {
      return res.status(400).json({ error: "Already timed out" });
    }

    existingTime.timeOut = moment(currentTimestamp, "YYYY-MM-DD HH:mm:ss").toDate();
    await existingTime.save();

    res.status(200).json({
      message: "Successfully timed out",
      empID: employee.empID,
      date: existingTime.date,
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
    // Find employee by workday ID
    const employee = await Emp.findOne({ empID: empID });
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    const existingTime = await Time.findOne({ empID: employee._id, date: date });
    if (!existingTime) {
      return res.status(404).json({
        error: "No time record found for this employee on the given date",
      });
    }

    existingTime.timeIn = moment(`${date} ${timeIn}`, "YYYY-MM-DD HH:mm:ss").toDate();
    await existingTime.save();

    res.status(200).json({
      message: "Successfully updated time-in",
      empID: employee.empID,
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
    // Find employee by workday ID
    const employee = await Emp.findOne({ empID: empID });
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    const existingTime = await Time.findOne({ empID: employee._id, date: date });
    if (!existingTime || !existingTime.timeIn) {
      return res.status(404).json({
        error: "No time-in record found for this employee on the given date",
      });
    }

    existingTime.timeOut = moment(`${date} ${timeOut}`, "YYYY-MM-DD HH:mm:ss").toDate();
    await existingTime.save();

    res.status(200).json({
      message: "Successfully updated time-out",
      empID: employee.empID,
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

  // Check if both empID and date are provided
  if (!empID || !date) {
    return res.status(400).json({ error: "empID and date are required" });
  }

  // Convert empID to a number, since it's stored as a Number in the Employee model
  const workdayID = Number(empID);

  try {
    // Find employee by workday ID
    const employee = await Emp.findOne({ empID: workdayID });
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    // Find existing time record for the given date
    const existingTime = await Time.findOne({ empID: employee._id, date: date });
    if (!existingTime) {
      return res.status(404).json({ error: "No time record found for this employee on the given date" });
    }

    // Delete the record
    await Time.findOneAndDelete({ empID: employee._id, date: date });
    res.status(200).json({ message: "Time In/Out deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get All Time Records for an Employee - GET /api/time/employee/:empID
const getEmployeeTimeRecords = async (req, res) => {
  // Here, req.params.empID is the workday ID
  const workdayID = req.params.empID;

  try {
    // Find employee by workday ID
    const employee = await Emp.findOne({ empID: workdayID });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const records = await Time.find({ empID: employee._id }).sort({ date: -1 });
    if (records.length === 0) {
      return res.status(404).json({ error: "No time records found for this employee" });
    }

    res.status(200).json(records);
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
  getEmployeeTimeRecords,
};
