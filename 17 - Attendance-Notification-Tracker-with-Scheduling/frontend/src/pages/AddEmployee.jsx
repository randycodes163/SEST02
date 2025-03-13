import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EmployeeForm() {
  const [empName, setEmpName] = useState("");
  const [empID, setEmpID] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Handle file selection from input change
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setPhoto(selectedFile);
      setPhotoPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle file drop in the drop zone
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setPhoto(droppedFile);
      setPhotoPreview(URL.createObjectURL(droppedFile));
    }
  };

  // Prevent default behavior for drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("empID", empID);
    formData.append("empName", empName);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating employee");
      }

      // ✅ Display success message and clear form
      setMessage("✅ Employee created successfully!");
      handleRefresh(); // Clears the form

      // Remove message after 3.5 seconds
      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);

      // Remove message after 3.5 seconds
      setTimeout(() => {
        setMessage("");
      }, 3500);
    }
  };

  const handleRefresh = () => {
    setEmpName("");
    setEmpID("");
    setPhoto(null);
    setPhotoPreview(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Employee</h2>

      {/* ✅ Show confirmation message */}
      {message && (
        <p style={{ color: message.includes("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmpName">
          <Form.Label>Employee Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter employee name"
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmpID">
          <Form.Label>Workday ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter workday ID"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPhoto">
          <Form.Label>Photo (optional)</Form.Label>
          <div
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {photo ? photo.name : "Drag and drop a file here, or click to select file."}
          </div>
          <Form.Control
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={photoPreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
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

export default EmployeeForm;
