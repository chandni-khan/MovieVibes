const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const movieController = require("../controllers/movieController");
const reviewController = require("../controllers/reviewController");
const likeController = require("../controllers/likeController");

// Authentication Routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Movie Routes
router.get("/movies", movieController.getAllMovies);
router.post("/movies", auth, movieController.addMovie);

// Review Routes
router.get("/movies/:movie_id/reviews", reviewController.getReviewsByMovie);
router.post("/reviews", auth, reviewController.addReview);

// Like Routes
router.post("/likes", auth, likeController.likeReview);
router.delete("/likes", auth, likeController.unlikeReview);

module.exports = router;
