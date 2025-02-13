import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

export default function AppNavbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Hide navbar on login and register routes
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/"; // Redirect to login page
  };

  if (hideNavbar || !token) return null; // Hide navbar if not logged in or on login/register

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/exam">
          Movie Vibes
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/movies">
            Movies List
          </Nav.Link>
          {role === "1" && (
            <Nav.Link as={Link} to="/admin/movies">
              Manage Movies{" "}
            </Nav.Link>
          )}
          <Button
            variant="outline-light"
            onClick={handleLogout}
            className="ms-3"
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
