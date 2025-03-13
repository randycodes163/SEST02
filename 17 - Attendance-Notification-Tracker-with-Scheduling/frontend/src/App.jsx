import Home from "./pages/Home";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import AddSchedule from "./pages/AddSchedule";
import Navigation from "./components/Navigation";
import Header from "./components/Header";  // import your new header component
import { Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <>
      <Header />
      <Navigation />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/schedule" element={<AddSchedule />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
