import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

const CustomNavbar = () => {
  const [navbar, setNavbar] = useState(false);

  const changeNavbar = () => {
    if (window.scrollY >= 50) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);
    return () => window.removeEventListener("scroll", changeNavbar);
  }, []);

  return (
    <Navbar expand="lg" className={navbar ? "navbar active" : "navbar"}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          Expense Splitter
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          </Nav>
          <Link to="/login">
            <Button variant="outline-light" className="ms-3">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" className="ms-2">Sign Up</Button>
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
