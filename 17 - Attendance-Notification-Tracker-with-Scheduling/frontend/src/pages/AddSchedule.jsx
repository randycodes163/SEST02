import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ScheduleForm() {
  const [empID, setEmpID] = useState("");
  const [week, setWeek] = useState("");
  const [restDays, setRestDays] = useState([]);
  const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [scheduledEndTime, setScheduledEndTime] = useState("");
  const [message, setMessage] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleCheckboxChange = (day, e) => {
    if (e.target.checked) {
      if (restDays.length < 2) {
        setRestDays([...restDays, day]);
      }
    } else {
      setRestDays(restDays.filter((d) => d !== day));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message

    if (!empID || !week || !scheduledStartTime || !scheduledEndTime) {
      setMessage("All fields are required.");
      return;
    }

    if (restDays.length !== 2) {
      setMessage("Please select exactly 2 rest days.");
      return;
    }

    const scheduleData = { empID, week, restDays, scheduledStartTime, scheduledEndTime };

    try {
      const response = await fetch("http://localhost:3000/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating schedule");
      }

      // ✅ Display success message and clear form
      setMessage("✅ Schedule created successfully!");
      handleRefresh(); // Clears the form
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleRefresh = () => {
    setEmpID("");
    setWeek("");
    setRestDays([]);
    setScheduledStartTime("");
    setScheduledEndTime("");
  };

  // Function to find the nearest Monday
  const getStartOfCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Days to subtract to get the previous Monday (or today if Monday)
    today.setDate(today.getDate() + diff);
    return today.toISOString().split("T")[0]; // Returns ISO date of Monday
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create a Schedule</h2>

      {/* ✅ Show confirmation message */}
      {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmpID">
          <Form.Label>Employee ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Employee ID"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formWeek">
          <Form.Label> Week Beginning</Form.Label>
          <Form.Control
            type="date"
            value={week}
            // Set min to the start of the current week (Monday)
            min={getStartOfCurrentWeek()}
            // Only allow Mondays every 7 days
            step="7"
            onChange={(e) => setWeek(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rest Days (Select exactly 2)</Form.Label>
          <div>
            {daysOfWeek.map((day) => (
              <Form.Check
                inline
                key={day}
                label={day}
                type="checkbox"
                checked={restDays.includes(day)}
                disabled={!restDays.includes(day) && restDays.length >= 2}
                onChange={(e) => handleCheckboxChange(day, e)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formScheduledStartTime">
          <Form.Label>Scheduled Start Time</Form.Label>
          <Form.Control
            type="time"
            value={scheduledStartTime}
            onChange={(e) => setScheduledStartTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formScheduledEndTime">
          <Form.Label>Scheduled End Time</Form.Label>
          <Form.Control
            type="time"
            value={scheduledEndTime}
            onChange={(e) => setScheduledEndTime(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            SUBMIT
          </Button>
          <Button variant="secondary" onClick={handleRefresh} className="ms-2">
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ScheduleForm;
