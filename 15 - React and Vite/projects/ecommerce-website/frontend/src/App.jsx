import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
// import { Routes, Route, Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";


// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Bootstrap
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Navigation from "./components/Navigation";

function App() {
  return (
    <Container>
      <div>
        {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav> */}
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
