# Library API

## Description

This is a simple library RESTful API built using Node.js, Express.js, MySQL, and JWT authentication. It provides functionality for managing books and user authentication.

## Getting Started

1. Clone the repository and navigate to the project directory.
2. Install dependencies by running `npm install`.
3. Set environment variables by creating a `.env` file and adding values for the following variables:
4. Start the server by running `npm start`.

# Environment Variables

The following environment variables are required to run the application:

- `MYSQL_CREATE_CONNECTION_HOST`: the hostname for the MySQL database.
- `MYSQL_CREATE_CONNECTION_USER`: the MySQL database username.
- `MYSQL_CREATE_CONNECTION_PASSWORD`: the MySQL database password.
- `MYSQL_CREATE_CONNECTION_DATABASE`: the name of the MySQL database to use.
- `JWT_SECRET`: the secret key used to sign and verify JWT tokens.

## Endpoints

### Books

- GET `/`: Get all books.
- GET `/available`: Get all available books.
- POST `/`: Add a new book.
- PUT `/:id`: Update a book.
- DELETE `/:id`: Delete a book.
- POST `/:id/borrow`: Borrow a book.
- POST `/:id/return`: Return a borrowed book.

### Authentication

- POST `/register`: Register a new user.
- POST `/login`: Log in a user.
- POST `/admin/register`: Register a new admin user.
- POST `/admin/login`: Log in an admin user.
- POST `/logout`: Log out a user or admin user.
