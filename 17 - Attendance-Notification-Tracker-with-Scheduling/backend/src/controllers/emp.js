const mongoose = require("mongoose");
const Emp = require("../models/emp");
const Schedule = require("../models/schedule");
const Time = require("../models/time");

// POST: Create a new Employee using workday ID (empID)
const createEmployee = async (req, res) => {
  const { empID, empName } = req.body;
  const photo = req.file ? req.file.path : undefined;

  try {
    const existingEmployee = await Emp.findOne({ empID });
    if (existingEmployee) {
      return res.status(400).json({ error: "Employee with the same workday ID already exists." });
    }
    const emp = await Emp.create({ empID, empName, photo });
    res.status(201).json(emp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve all employees
const getAllEmployee = async (req, res) => {
  try {
    const employees = await Emp.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve a specific employee by MongoDB _id
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const emp = await Emp.findById(id);
    if (!emp) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json(emp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  let { id } = req.params;
  const { empName, restDays, scheduledStartTime, scheduledEndTime } = req.body;
  const photo = req.file ? req.file.path : undefined;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid employee ID format" });
  }

  id = new mongoose.Types.ObjectId(id);

  try {
    // 🔹 Parse `restDays` safely
    let parsedRestDays;
    try {
      parsedRestDays = typeof restDays === "string" ? JSON.parse(restDays) : restDays;
    } catch (error) {
      return res.status(400).json({ error: "Invalid format for restDays. Must be a JSON array." });
    }

    // 🔹 Ensure we are updating the **current week's** schedule
    const getCurrentWeekStart = () => {
      const today = new Date();
      today.setDate(today.getDate() - today.getDay() + 1); // Get Monday of this week
      return today.toISOString().split("T")[0];
    };

    const currentWeek = getCurrentWeekStart();

    let schedule = await Schedule.findOne({ empID: id, week: currentWeek });

    // 🔹 Validate rest days only if the employee has a schedule
    if (schedule && (!Array.isArray(parsedRestDays) || parsedRestDays.length !== 2)) {
      return res.status(400).json({ error: "Exactly 2 rest days must be selected." });
    }

    // 🔹 Update Employee details (preserve existing photo if none uploaded)
    const updateFields = { empName };
    if (photo) updateFields.photo = photo;

    const emp = await Emp.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!emp) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (!schedule) {
      console.warn("⚠️ No existing schedule found for employee. Skipping schedule update.");
    } else {
      // 🔹 Update schedule only if it exists
      schedule.days.forEach((day) => {
        if (parsedRestDays.includes(day.day)) {
          day.isRestDay = true;
          day.scheduledStartTime = null;
          day.scheduledEndTime = null;
        } else {
          day.isRestDay = false;
          day.scheduledStartTime = scheduledStartTime || day.scheduledStartTime;
          day.scheduledEndTime = scheduledEndTime || day.scheduledEndTime;
        }
      });

      await schedule.save();
    }

    res.status(200).json({ message: "Successfully Updated!", emp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid employee ID format" });
  }

  try {
    // 🔹 Delete employee record
    const emp = await Emp.findByIdAndDelete(id);
    if (!emp) return res.status(404).json({ error: "Employee not found" });

    // 🔹 Delete associated schedule records
    await Schedule.deleteMany({ empID: id });

    // 🔹 Delete associated time records
    await Time.deleteMany({ empID: id });

    res.status(200).json({ message: "Employee and all associated data deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEmployeesWithDetails = async (req, res) => {
  try {
    const employees = await Emp.find().populate({
      path: "schedule",
      model: "Schedule",
    });

    if (!employees.length) {
      return res.status(404).json({ error: "No employees found" });
    }

    // ✅ Debugging log: Check if _id is included
    console.log("Employees Data Sent to Frontend:", JSON.stringify(employees, null, 2));

    const getCurrentWeekStart = () => {
      const today = new Date();
      const day = today.getDay();
      const diff = day === 1 ? 0 : day === 0 ? -6 : 1 - day;
      today.setDate(today.getDate() + diff);
      return today.toISOString().split("T")[0];
    };

    const currentWeek = getCurrentWeekStart();

    const employeeDetails = await Promise.all(
      employees.map(async (employee) => {
        const schedule = await Schedule.findOne({ empID: employee._id, week: currentWeek });
        return {
          _id: employee._id, // ✅ Ensure _id is returned
          empID: employee.empID,
          empName: employee.empName,
          photo: employee.photo,
          schedule: schedule ? schedule.days : [],
        };
      })
    );

    res.status(200).json(employeeDetails);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createEmployee,
  getAllEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployeesWithDetails,
};
