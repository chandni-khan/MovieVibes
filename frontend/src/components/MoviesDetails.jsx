import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  Container,
  ListGroup,
  Spinner,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axios from "axios";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [sortBy]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const fetchMovieDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/movies/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMovie(response.data);
    } catch (error) {
      showAlert("danger", "Error fetching movie details.");
      console.error("Error fetching movie details:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/movies/${id}/reviews?sort=${sortBy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(response.data);
    } catch (error) {
      showAlert("danger", "Error fetching reviews.");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/reviews`,
        { movie_id: id, review_text: reviewText, rating: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([response.data, ...reviews]);
      setReviewText("");
      showAlert("success", "Review added successfully!");
    } catch (error) {
      showAlert("danger", "Error adding review.");
      console.error("Error adding review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/likes`,
        { review_id: reviewId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews();
      showAlert("success", "Review liked!");
    } catch (error) {
      showAlert("danger", "Error liking review.");
      console.error("Error liking review:", error);
    }
  };

  const handleUnLikeReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/likes/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
      showAlert("success", "Review unliked!");
    } catch (error) {
      showAlert("danger", "Error unliking review.");
      console.error("Error unliking review:", error);
    }
  };

  const handleEditReview = (reviewId, text) => {
    setEditingReviewId(reviewId);
    setReviewText(text);
  };

  const handleUpdateReview = async () => {
    if (!reviewText.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/reviews/${editingReviewId}`,
        { review_text: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReviewId(null);
      setReviewText("");
      fetchReviews();
      showAlert("success", "Review updated successfully!");
    } catch (error) {
      showAlert("danger", "Error updating review.");
      console.error("Error updating review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((review) => review.id !== reviewId));
      showAlert("success", "Review deleted successfully!");
    } catch (error) {
      showAlert("danger", "Error deleting review.");
      console.error("Error deleting review:", error);
    }
  };

  if (!movie)
    return (
      <p className="text-center mt-5 text-muted">Loading movie details...</p>
    );

  return (
    <Container className="mt-4">
      {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Row>
        {/* Movie Details - Left Column */}
        <Col md={6}>
          <Card className="shadow-lg rounded-3 border-0 overflow-hidden">
            <Card.Img
              variant="top"
              src={"/pics/download (2).jpg"}
              alt={movie.title}
              style={{ height: "180px", objectFit: "cover",margin: '2px'}}
            />
            <Card.Body className="">
              <Card.Title className="text-dark fw-bold display-6 text-center">
                {movie.title}
              </Card.Title>
              <Card.Text className="text-muted text-center">
                {movie.description}
              </Card.Text>
              <Card.Text className="text-center">
                <strong>Rating:</strong> ⭐⭐⭐⭐ {movie.rating}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Review Form */}
          <Card className="p-4 mt-4 shadow rounded-3 border-0">
            <h5 className="text-center mb-3 text-dark">Write a Review</h5>
            <Form.Group controlId="review">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mb-3 rounded-3"
              />
              <Button
                className="w-100 rounded-pill fw-bold"
                variant="primary"
                onClick={
                  editingReviewId ? handleUpdateReview : handleReviewSubmit
                }
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner animation="border" size="sm" />
                ) : editingReviewId ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </Button>
            </Form.Group>
          </Card>
        </Col>

        {/* Reviews Section - Right Column */}
        <Col md={6}>
          <h3 className="text-center text-dark">User Reviews</h3>

          {/* Sorting Buttons */}
          <Row className="mt-3 text-center">
            <Col>
              <Button
                variant={sortBy === "recent" ? "dark" : "secondary"}
                className="rounded-pill"
                onClick={() => setSortBy("recent")}
              >
                Sort by Recent
              </Button>
            </Col>
            <Col>
              <Button
                variant={sortBy === "popularity" ? "dark" : "secondary"}
                className="rounded-pill"
                onClick={() => setSortBy("popularity")}
              >
                Sort by Popularity
              </Button>
            </Col>
          </Row>

          {/* Scrollable Reviews Section */}
          <div
            className="mt-3 p-2 border rounded-3 shadow-sm"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {loading ? (
              <p className="text-center text-muted">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted">No reviews yet.</p>
            ) : (
              <ListGroup>
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="mt-3 shadow rounded-3 border-0 p-3"
                  >
                    <Card.Body>
                      <Card.Text className="text-muted">
                        {review.review_text}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Likes: {review.likes}
                        </small>
                        <div>
                          <Button
                            variant={
                              review.isLiked ? "dark" : "outline-primary"
                            }
                            size="sm"
                            className="me-2 rounded-pill"
                            onClick={() =>
                              review.isLiked
                                ? handleUnLikeReview(review.id)
                                : handleLikeReview(review.id)
                            }
                          >
                            👍 Like
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2 rounded-pill"
                            onClick={() =>
                              handleEditReview(review.id, review.review_text)
                            }
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MovieDetail;
