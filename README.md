# MovieVibes - Movie Rating Website
MovieVibes is a full-stack movie rating and review platform where users can sign up, log in, rate, and review movies. Users can also like other reviews, sort them by popularity or recency, and manage their own reviews. An admin panel allows for managing movies and reviews efficiently.

## Overview
This is a full-stack movie rating website where users can sign up, log in, rate, and review movies. Users can also like other users’ reviews. The application includes an admin panel where only authorized users can manage movies.

## Features
- User authentication (Sign up, Login, JWT-based authentication)
- View a list of movies
- View movie details, reviews, and ratings
- Add, edit, and delete movie reviews (authorized users only)
- Like/unlike movie reviews
- Admin panel to manage movies (CRUD operations, accessible only to admins)

## Tech Stack
### Frontend:
- React.js
- React Router
- Bootstrap
- Axios

### Backend:
- Node.js
- Express.js
- MySQL (Database)
- JWT for authentication
- dotenv for environment variables

## Database Setup
The SQL queries to create the database and tables are already provided in the project. Make sure to import the database schema before running the project.

### Sample Database Schema (SQL)
```sql
CREATE DATABASE movie_rating;
USE movie_rating;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role INT DEFAULT 0 -- 0: User, 1: Admin
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_year INT NOT NULL,
    rating FLOAT DEFAULT 0
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    review TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);
```

## Environment Variables
Create a `.env` file in the root of the project and add the following:

```env
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=movie_rating
JWT_SECRET=your_secret_key
```

## Installation and Setup
### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/chandni-khan/MovieVibes.git
   cd 
   ```

2. Install backend dependencies:
   ```sh
   npm install
   ```

3. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install frontend dependencies:
   ```sh
   npm install
   ```

3. Start the frontend development server:
   ```sh
   npm start
   ```

## Running the Application
- Open `http://localhost:3000` in your browser to access the frontend.
- The backend runs on `http://localhost:5000`.
- Make sure MySQL is running and the database is correctly configured.

## API Routes
### Public Routes:
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and return a JWT
- `GET /api/movies` - Fetch all movies
- `GET /api/movies/:id` - Fetch movie details

### Protected Routes (Require Authentication):
- `POST /api/reviews` - Add a movie review
- `PUT /api/reviews/:id` - Edit a review
- `DELETE /api/reviews/:id` - Delete a review

### Admin Routes (Require Admin Role):
-`you have to revoke admin permission by changing user role to 1 in DB only, Database admin can do that
- `POST /api/movies` - Add a new movie
- `PUT /api/movies/:id` - Update movie details
- `DELETE /api/movies/:id` - Delete a movie

## Deployment
To deploy the project:
- Use a hosting service like Vercel for the frontend.

## Contributing
Feel free to open issues and submit pull requests to enhance the project.

## License
This project is licensed under the MIT License.

