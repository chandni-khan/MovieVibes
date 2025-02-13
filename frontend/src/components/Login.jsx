import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        data
      );

      if (response.data.token && response.data.role !== undefined) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
          navigate("/movies");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="login-container">
      <div className="app-info">
        <h1 className="app-title">Welcome Back to Movie Vibes!</h1>
        <p className="app-description">
          Join a growing community of movie lovers!
          <strong>
            {" "}
            Don't have an account yet? Register now to get started!
          </strong>
        </p>
      </div>

      <h2 className="login-heading">Login</h2>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group controlId="formEmail" className="form-group">
          <Form.Label className="form-label">Email</Form.Label>
          <Form.Control
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="form-control"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label className="form-label">Password</Form.Label>
          <Form.Control
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="form-control"
            required
          />
        </Form.Group>

        {error && (
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        )}

        <Button
          variant="primary"
          type="submit"
          className="submit-button"
          disabled={loading || !data.email || !data.password}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Login"}
        </Button>
      </Form>

      <Button
        variant="link"
        onClick={() => navigate("/register")}
        className="register-button"
      >
        Don't have an account? Register
      </Button>
    </div>
  );
}

export default Login;
