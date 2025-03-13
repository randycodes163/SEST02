import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css"; // Import custom CSS

function Navigation() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" className="nav-brand d-flex align-items-center">
          {/* Animated Clock Icon */}
          <lord-icon
            src="https://cdn.lordicon.com/kbtmbyzy.json"
            trigger="loop"
            delay="2000"
            colors="primary:#D4AF37,secondary:#D4AF37"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          ></lord-icon>
          Attendance Tracking with Scheduling System
        </Navbar.Brand>

        {/* Hamburger Icon */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="custom-toggler"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link ${activeLink === "/" ? "active-link" : ""}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/employees"
              className={`nav-link ${
                activeLink === "/employees" ? "active-link" : ""
              }`}
            >
              Employees
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/employees/add"
              className={`nav-link ${
                activeLink === "/employees/add" ? "active-link" : ""
              }`}
            >
              Add Employee
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/employees/schedule"
              className={`nav-link ${
                activeLink === "/employees/schedule" ? "active-link" : ""
              }`}
            >
              Create Schedule
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
