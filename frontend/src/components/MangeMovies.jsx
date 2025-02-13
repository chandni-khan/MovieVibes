import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

export default function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Fetch movies on load
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
       const response = await axios.get("http://localhost:5000/api/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  const handleShowModal = (movie = null) => {
    setEditingMovie(movie);
    setFormData(
      movie ? { ...movie } : { title: "", description: "", rating: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMovie(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      const token = localStorage.getItem("token");
    e.preventDefault();
    setLoading(true);
    try {
      if (editingMovie) {
        await axios.put(
          `http://localhost:5000/api/movies/${editingMovie.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlert({ message: "Movie updated successfully!", type: "success" });
      } else {
        await axios.post("http://localhost:5000/api/movies", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({ message: "Movie added successfully!", type: "success" });
      }
      fetchMovies();
      handleCloseModal();
    } catch (error) {
      setAlert({ message: "Error saving movie!", type: "danger" });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
      const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ message: "Movie deleted successfully!", type: "success" });
      fetchMovies();
    } catch (error) {
      setAlert({ message: "Error deleting movie!", type: "danger" });
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Movies</h2>

      {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleShowModal()}
      >
        ➕ Add New Movie
      </Button>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>⭐ {movie.ratings}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(movie)}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(movie.id)}
                >
                  🗑️ Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Movie Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMovie ? "Edit Movie" : "Add Movie"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="rating" className="mt-2">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                required
              />
            </Form.Group>

            <Button
              className="w-100 mt-3"
              variant="success"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : editingMovie ? (
                "Update Movie"
              ) : (
                "Add Movie"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
