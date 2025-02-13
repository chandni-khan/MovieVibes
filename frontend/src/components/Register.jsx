import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  // Email Validation Function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle Email Input Change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setData({ ...data, email });
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register", // Backend API endpoint
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      const { message } = response.data;

      if (message === "User registered successfully") {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000); // Redirect after 2s
      } else {
        setError(message || "Unexpected server response.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="app-info">
        <h1 className="app-title">Join Movie Vibes Today!</h1>
        <p className="app-description">
          Create an account to{" "}
          <b>rate movies, write reviews, and like other users’ thoughts</b>.
          Join a growing community of movie lovers!
          <br />
          <strong>Start your journey now!</strong>
        </p>
      </div>

      <h2 className="register-heading">Sign Up</h2>
      <Form onSubmit={handleSubmit} className="register-form">
        {/* Success Message */}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {/* Name Field */}
        <Form.Group controlId="formName" className="form-group">
          <Form.Label className="form-label">Full Name</Form.Label>
          <Form.Control
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="form-control"
            placeholder="Enter your full name"
            required
          />
        </Form.Group>

        {/* Email Field */}
        <Form.Group controlId="formEmail" className="form-group">
          <Form.Label className="form-label">Email</Form.Label>
          <Form.Control
            type="email"
            value={data.email}
            onChange={handleEmailChange}
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            placeholder="Enter your email"
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </Form.Group>

        {/* Password Field */}
        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label className="form-label">Password</Form.Label>
          <Form.Control
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="form-control"
            placeholder="Create a strong password"
            required
          />
        </Form.Group>

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Register Button */}
        <Button
          variant="primary"
          type="submit"
          className="submit-button"
          disabled={!data.name || !data.email || !data.password || emailError}
        >
          Register
        </Button>
      </Form>

      {/* Login Redirect */}
      <Button
        variant="link"
        onClick={() => navigate("/")}
        className="login-redirect-button"
      >
        Already have an account? Login
      </Button>
    </div>
  );
}

export default Register;
