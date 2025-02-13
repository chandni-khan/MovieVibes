const queries = {
  // Users
  CREATE_USER: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
  GET_USER_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,

  // Movies
  GET_ALL_MOVIES: `SELECT * FROM movies`,
  GET_MOVIE_BY_ID: `SELECT * FROM movies WHERE id = ?`,
  ADD_MOVIE: `INSERT INTO movies (title, description, release_year) VALUES (?, ?, ?)`,
  DELETE_MOVIE: `DELETE FROM movies WHERE id = ?`,

  // Reviews
  GET_REVIEWS_BY_MOVIE: `SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC`,
  ADD_REVIEW: `INSERT INTO reviews (user_id, movie_id, rating, review_text) VALUES (?, ?, ?, ?)`,
  DELETE_REVIEW: `DELETE FROM reviews WHERE id = ? AND user_id = ?`,

  // Likes
  LIKE_REVIEW: `INSERT INTO likes (user_id, review_id) VALUES (?, ?)`,
  UNLIKE_REVIEW: `DELETE FROM likes WHERE user_id = ? AND review_id = ?`,
  GET_LIKE_COUNT: `SELECT COUNT(*) AS likes FROM likes WHERE review_id = ?`,
};

module.exports = queries;
