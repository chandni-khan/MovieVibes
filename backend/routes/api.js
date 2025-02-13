const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const authController = require("../controllers/authController");
const movieController = require("../controllers/movieController");
const reviewController = require("../controllers/reviewController");
const likeController = require("../controllers/likeController");

// 🔹 Authentication Routes
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// Public Routes
router.get("/movies", movieController.getAllMovies);
router.get("/movies/:movie_id", movieController.getMovieById);

// Admin-Only Routes
router.post("/movies", auth, isAdmin, movieController.addMovie);
router.put("/movies/:movie_id", auth, isAdmin, movieController.updateMovie);
router.delete("/movies/:movie_id", auth, isAdmin, movieController.deleteMovie);

// Review Routes
router.get("/movies/:movie_id/reviews",auth, reviewController.getReviewsByMovie);
router.post("/reviews", auth, reviewController.addReview);
router.put("/reviews/:review_id", auth, reviewController.updateReview);
router.delete("/reviews/:review_id", auth, reviewController.deleteReview);

// Like Routes
router.post("/likes", auth, likeController.likeReview);
router.delete("/likes/:review_id", auth, likeController.unlikeReview);

module.exports = router;
