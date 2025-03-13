// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Header() {
  const [headerPhoto, setHeaderPhoto] = useState("uploads/default-header.jpg"); // default image path
  const [isEditing, setIsEditing] = useState(false);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  // Background position state (default centered)
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);

  // Fetch the current header photo from your backend
  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/header");
        if (res.ok) {
          const data = await res.json();
          // Replace backslashes with forward slashes in the file path
          const fixedPath = data.photo.replace(/\\/g, "/");
          setHeaderPhoto(fixedPath);
        }
      } catch (error) {
        console.error("Error fetching header photo:", error.message);
      }
    };
    fetchHeader();
  }, []);

  // Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Update header photo via backend
  const handleUpdate = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const res = await fetch("http://localhost:3000/api/header", {
        method: "POST", // or PUT depending on your backend design
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error updating header");
      } else {
        const fixedPath = data.photo.replace(/\\/g, "/");
        setHeaderPhoto(fixedPath);
        setMessage("Header updated successfully!");
        setIsEditing(false);
        setFile(null);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Remove header photo (reset to default)
  const handleRemove = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/header", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error removing header");
      } else {
        const fixedPath = data.photo.replace(/\\/g, "/");
        setHeaderPhoto(fixedPath);
        setMessage("Header removed successfully!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Handlers for repositioning the header image
  const handleMouseDown = (e) => {
    if (!isRepositioning) return;
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isRepositioning || !dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!isRepositioning) return;
    setDragging(false);
    setMessage("Background position updated");
    // Optionally, send bgPos to the backend to persist the new position
  };

  return (
    <header
      style={{
        height: "25vh",
        backgroundColor: "#ccc",
        backgroundImage: `url(http://localhost:3000/${headerPhoto}?t=${Date.now()})`,
        backgroundSize: "cover",
        backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
        position: "relative",
        cursor: isRepositioning ? "move" : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isEditing ? (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <Form.Group controlId="headerFile" className="mb-2">
            <Form.Label>Update Header Photo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
          <div>
            <Button variant="primary" onClick={handleUpdate}>
              Save
            </Button>{" "}
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          <Button variant="light" onClick={() => setIsEditing(true)}>
            <i className="bi bi-upload"></i>
          </Button>
          <Button
            variant={isRepositioning ? "success" : "warning"}
            onClick={() => setIsRepositioning((prev) => !prev)}
          >
            <i className="bi bi-arrows-move"></i>
          </Button>
          <Button variant="danger" onClick={handleRemove}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )}
      {message && (
        <div style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}>
          {message}
        </div>
      )}
    </header>
  );
}

export default Header;
