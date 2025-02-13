import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Movies List</h2>
      <Row>
        {movies.map((movie) => (
          <Col md={4} key={movie.id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={"/pics/download (2).jpg"}
                alt={movie.title}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.description || "N/A"}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MoviesList;
