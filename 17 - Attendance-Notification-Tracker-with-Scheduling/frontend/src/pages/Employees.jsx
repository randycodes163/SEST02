import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [message, setMessage] = useState("");

  // Function to fetch employees (reusable for both initial loading and after update)
  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/employees/details"
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees initially when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []); // Empty dependency array to run only once on mount

  const handleEditClick = (employee) => {
    console.log("Clicked Employee Data:", employee); // ✅ Debugging log

    setEditingEmployee({
      ...employee,
      _id: employee._id || employee.empID?.toString(), // ✅ Convert empID to string if needed
    });

    const hasScheduleForCurrentWeek = employee.schedule?.length > 0;

    setEditedData({
      empName: employee.empName,
      empID: employee.empID,
      _id: employee._id || employee.empID?.toString(), // ✅ Ensure _id is passed here too
      restDays: hasScheduleForCurrentWeek
        ? employee.schedule.filter((day) => day.isRestDay).map((day) => day.day)
        : [],
      scheduledStartTime: hasScheduleForCurrentWeek
        ? employee.schedule.find((day) => !day.isRestDay)?.scheduledStartTime ||
          ""
        : "",
      scheduledEndTime: hasScheduleForCurrentWeek
        ? employee.schedule.find((day) => !day.isRestDay)?.scheduledEndTime ||
          ""
        : "",
      photo: employee.photo || null,
      newPhoto: null,
      previewPhoto: employee.photo
        ? `http://localhost:3000/${employee.photo}`
        : null,
      hasScheduleForCurrentWeek,
    });

    setMessage("");
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setEditedData({
        ...editedData,
        newPhoto: file,
        previewPhoto: URL.createObjectURL(file),
      });
    }
  };

  const handleCheckboxChange = (day) => {
    let updatedRestDays;
    if (editedData.restDays.includes(day)) {
      updatedRestDays = editedData.restDays.filter((d) => d !== day);
    } else {
      if (editedData.restDays.length < 2) {
        updatedRestDays = [...editedData.restDays, day];
      } else {
        setMessage("❌ You can only select 2 rest days.");
        return;
      }
    }
    setEditedData({ ...editedData, restDays: updatedRestDays });
    setMessage("");
  };

  const handleCloseModal = () => {
    setEditingEmployee(null);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this employee? This will remove all related data!"
      )
    ) {
      return;
    }

    try {
      console.log(`Deleting employee with ID: ${id}`);

      const response = await fetch(
        `http://localhost:3000/api/employees/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete employee: ${errorText}`);
      }

      console.log("✅ Employee deleted successfully!");
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));

      // ✅ Show success message
      showNotification("✅ Employee deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting employee:", error);
      showNotification(`❌ Error deleting employee: ${error.message}`, "error");
    }
  };

  const handleSave = async () => {
    console.log("Editing Employee Data Before Saving:", editingEmployee);
    console.log("Edited Rest Days Before Saving:", editedData.restDays);

    if (!editingEmployee || !editingEmployee._id) {
      setMessage("❌ Error: Employee ID is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("empName", editedData.empName);

    // Append only if schedule exists
    if (editedData.hasScheduleForCurrentWeek) {
      if (editedData.restDays.length !== 2) {
        setMessage("❌ Exactly 2 rest days must be selected.");
        return;
      }
      formData.append(
        "scheduledStartTime",
        editedData.scheduledStartTime || ""
      );
      formData.append("scheduledEndTime", editedData.scheduledEndTime || "");
      formData.append("restDays", JSON.stringify(editedData.restDays));
    }

    if (editedData.newPhoto) {
      formData.append("photo", editedData.newPhoto);
    }

    try {
      console.log(
        `Sending update request to: http://localhost:3000/api/employees/${editingEmployee._id}`
      );

      const response = await fetch(
        `http://localhost:3000/api/employees/${editingEmployee._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update employee: ${errorText}`);
      }

      const updatedEmployee = await response.json();
      console.log("✅ Employee Updated Successfully:", updatedEmployee);

      await fetchEmployees(); // Refresh employee list

      setEditingEmployee(null);
      setMessage("✅ Employee successfully updated!");
    } catch (error) {
      console.error("Error updating employee:", error);
      setMessage(`❌ Error updating employee: ${error.message}`);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <br />
      <br />
      <h1>List of Employees</h1>
      <br />
      <br />
      <div className="container">
        <div
          className={`row ${
            employees.length === 1 ? "justify-content-center" : ""
          } row-cols-1 row-cols-md-2 row-cols-lg-4 g-3`}
        >
          {employees.map((employee) => (
            <div
              className="col d-flex justify-content-center"
              key={employee.empID}
            >
              <Card className="h-100 shadow-sm fixed-card">
                <Card.Img
                  variant="top"
                  src={
                    editingEmployee?.empID === employee.empID &&
                    editedData.previewPhoto
                      ? editedData.previewPhoto
                      : `http://localhost:3000/${employee.photo}`
                  }
                  alt={`${employee.empName}'s photo`}
                  className="card-img-top"
                />
                <Card.Body>
                  <Card.Title>{employee.empName}</Card.Title>
                  <Card.Text>
                    <strong>Workday ID:</strong> {employee.empID}
                  </Card.Text>
                  <Card.Text>
                    <strong>Rest Days: </strong>
                    {employee.schedule?.length > 0
                      ? employee.schedule
                          .filter((day) => day.isRestDay)
                          .map((day) => day.day)
                          .join(", ") || "N/A"
                      : "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Work Hours: </strong>
                    {employee.schedule?.length > 0
                      ? `${
                          employee.schedule.find((day) => !day.isRestDay)
                            ?.scheduledStartTime || "N/A"
                        } - 
                   ${
                     employee.schedule.find((day) => !day.isRestDay)
                       ?.scheduledEndTime || "N/A"
                   }`
                      : "N/A"}
                  </Card.Text>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditClick(employee)}
                    >
                      <i className="bi bi-pencil-square icon-yellow"></i>
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(employee._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Modal show={editingEmployee !== null} onHide={handleCloseModal} centered>
        {editingEmployee && (
          <Modal.Body>
            <div style={{ display: "flex", gap: "20px" }}>
              {/* Employee Card with Instant Photo Preview */}
              <Card style={{ width: "250px", backgroundColor: "white" }}>
                {editedData.previewPhoto && (
                  <Card.Img
                    variant="top"
                    src={editedData.previewPhoto}
                    alt="New Photo Preview"
                  />
                )}
                <Card.Body>
                  <Card.Title>{editedData.empName}</Card.Title>
                  <Card.Text>
                    <strong>ID:</strong> {editedData.empID}
                  </Card.Text>
                </Card.Body>
              </Card>

              {/* Editing Form */}
              <div style={{ flex: 1 }}>
                {message && <p style={{ color: "red" }}>{message}</p>}

                <Form.Group className="mb-2">
                  <Form.Label>Upload New Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedData.empName}
                    onChange={(e) =>
                      handleInputChange("empName", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Workday ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedData.empID}
                    disabled={true} // 🔹 This will gray out the field
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Rest Days (Select exactly 2)</Form.Label>
                  <div>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <Form.Check
                        inline
                        key={day}
                        label={day}
                        type="checkbox"
                        checked={editedData.restDays.includes(day)}
                        disabled={!editedData.hasScheduleForCurrentWeek}
                        onChange={() => handleCheckboxChange(day)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Scheduled Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={editedData.scheduledStartTime}
                    disabled={!editedData.hasScheduleForCurrentWeek}
                    onChange={(e) =>
                      handleInputChange("scheduledStartTime", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Scheduled End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={editedData.scheduledEndTime}
                    disabled={!editedData.hasScheduleForCurrentWeek}
                    onChange={(e) =>
                      handleInputChange("scheduledEndTime", e.target.value)
                    }
                  />
                </Form.Group>

                <div className="mt-2 d-flex justify-content-between">
                  <Button variant="success" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}

export default Employees;
