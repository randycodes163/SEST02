import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";

function EmployeeTimeRecords() {
  const [empID, setEmpID] = useState("");
  const [employee, setEmployee] = useState(null);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // For inline editing:
  const [editingRecord, setEditingRecord] = useState(null);
  const [newTimeInHour, setNewTimeInHour] = useState("");
  const [newTimeInMinute, setNewTimeInMinute] = useState("");
  const [newTimeOutHour, setNewTimeOutHour] = useState("");
  const [newTimeOutMinute, setNewTimeOutMinute] = useState("");

  // Generate options for hours (00 to 23) and minutes (00 to 59)
  const hourOptions = [];
  for (let i = 0; i < 24; i++) {
    hourOptions.push(i.toString().padStart(2, "0"));
  }
  const minuteOptions = [];
  for (let i = 0; i < 60; i++) {
    minuteOptions.push(i.toString().padStart(2, "0"));
  }

  const getCurrentTimestamp = () => new Date().toISOString();

  // Time In API call
  const handleTimeIn = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!empID.trim()) {
      setMessage("Please enter Workday ID!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/time/timeIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empID }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Error in Time In");
      } else {
        setMessage("Time In successful!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Time Out API call
  const handleTimeOut = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!empID.trim()) {
      setMessage("Please enter Workday ID!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/time/timeOut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empID }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Error in Time Out");
      } else {
        setMessage("Time Out successful!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Fetch employee info
  const fetchEmployeeInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${empID}`);
      if (!response.ok) {
        throw new Error("Employee not found");
      }
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      setMessage(error.message);
      setEmployee(null);
    }
  };

  // Fetch time records
  const fetchTimeRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/time/employee/${empID}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch time records");
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      setMessage(error.message);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisplayRecords = async () => {
    setMessage("");
    if (!empID.trim()) {
      setMessage("Please enter Workday ID!");
      return;
    }
    await fetchEmployeeInfo();
    await fetchTimeRecords();
  };

  // Start inline editing for a record and prefill dropdowns with existing values (or default to "00")
  const handleStartEdit = (record) => {
    setEditingRecord(record);
    const formatTime = (time) => {
      if (time) {
        const d = new Date(time);
        return {
          hour: d.getHours().toString().padStart(2, "0"),
          minute: d.getMinutes().toString().padStart(2, "0"),
        };
      }
      return { hour: "00", minute: "00" };
    };
    const timeInVals = formatTime(record.timeIn);
    const timeOutVals = formatTime(record.timeOut);
    setNewTimeInHour(timeInVals.hour);
    setNewTimeInMinute(timeInVals.minute);
    setNewTimeOutHour(timeOutVals.hour);
    setNewTimeOutMinute(timeOutVals.minute);
  };

  const handleCancelUpdate = () => {
    setEditingRecord(null);
    setNewTimeInHour("");
    setNewTimeInMinute("");
    setNewTimeOutHour("");
    setNewTimeOutMinute("");
  };

  // Save updates using dropdown selections
  const handleSaveUpdate = async () => {
    if (!editingRecord) return;
    // Combine selected hour and minute with fixed seconds "00"
    const updatedTimeIn = `${newTimeInHour}:${newTimeInMinute}:00`;
    const updatedTimeOut = `${newTimeOutHour}:${newTimeOutMinute}:00`;

    // Update Time In
    try {
      const responseIn = await fetch("http://localhost:3000/api/time/updateTimeIn", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empID, date: editingRecord.date, timeIn: updatedTimeIn }),
      });
      const dataIn = await responseIn.json();
      if (!responseIn.ok) {
        setMessage(dataIn.error || "Error updating Time In");
        return;
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      return;
    }

    // Update Time Out
    try {
      const responseOut = await fetch("http://localhost:3000/api/time/updateTimeOut", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empID, date: editingRecord.date, timeOut: updatedTimeOut }),
      });
      const dataOut = await responseOut.json();
      if (!responseOut.ok) {
        setMessage(dataOut.error || "Error updating Time Out");
        return;
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Record updated successfully!");
    setEditingRecord(null);
    setNewTimeInHour("");
    setNewTimeInMinute("");
    setNewTimeOutHour("");
    setNewTimeOutMinute("");
    await fetchTimeRecords();
  };

  // Delete a time record
  const handleDelete = async (record) => {
    try {
      const response = await fetch("http://localhost:3000/api/time/deleteTime", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empID, date: record.date }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Error deleting record");
      } else {
        setMessage("Record deleted successfully!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    await fetchTimeRecords();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Time Records</h1>
      <Form>
        <Form.Group controlId="formEmpID">
          <Form.Label>Workday ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Workday ID"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
          />
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "flex-start", gap: "0" }} className="mt-2">
          <Button variant="success" onClick={handleTimeIn}>
            Time In
          </Button>
          <Button variant="danger" onClick={handleTimeOut}>
            Time Out
          </Button>
          <Button variant="info" onClick={handleDisplayRecords}>
            Display Time Records
          </Button>
        </div>
      </Form>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {employee && (
        <div style={{ marginTop: "20px" }}>
          <h3>Employee Information</h3>
          <p>
            <strong>Fullname:</strong> {employee.empName}
          </p>
          <p>
            <strong>Workday ID:</strong> {employee.empID}
          </p>
        </div>
      )}

      <hr />

      <h3>Time Records for Employee {empID}</h3>
      {isLoading ? (
        <p>Loading records...</p>
      ) : records.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {records.map((record) => (
            <div
              key={record._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {editingRecord && editingRecord._id === record._id ? (
                <>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <span>
                      <strong>Date:</strong> {record.date}
                    </span>
                    <span>
                      <strong>Time In:</strong>
                      <select
                        value={newTimeInHour}
                        onChange={(e) => setNewTimeInHour(e.target.value)}
                      >
                        {hourOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      :
                      <select
                        value={newTimeInMinute}
                        onChange={(e) => setNewTimeInMinute(e.target.value)}
                      >
                        {minuteOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>
                      <strong>Time Out:</strong>
                      <select
                        value={newTimeOutHour}
                        onChange={(e) => setNewTimeOutHour(e.target.value)}
                      >
                        {hourOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      :
                      <select
                        value={newTimeOutMinute}
                        onChange={(e) => setNewTimeOutMinute(e.target.value)}
                      >
                        {minuteOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                    <Button variant="primary" onClick={handleSaveUpdate}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancelUpdate}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <span>
                      <strong>Date:</strong> {record.date}
                    </span>
                    <span>
                      <strong>Time In:</strong>{" "}
                      {record.timeIn ? new Date(record.timeIn).toLocaleTimeString() : "N/A"}
                    </span>
                    <span>
                      <strong>Time Out:</strong>{" "}
                      {record.timeOut ? new Date(record.timeOut).toLocaleTimeString() : "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                    <Button variant="warning" onClick={() => handleStartEdit(record)}>
                      Update
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(record)}>
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No time records found for this employee.</p>
      )}
    </div>
  );
}

export default EmployeeTimeRecords;
