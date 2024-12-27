# Node.js Backend for Movie and Color Data Management

## Overview

This project is a backend API developed using **Node.js**, **Express**, **MySQL**, and **MongoDB**. It provides RESTful endpoints for managing data related to movies, actors, customers, and colors. The API connects to two databases: a MySQL database (`sakila`) and MongoDB (`sample_mflix` and `cs480_project2`).

---

## Features

### MySQL Integration:
- **Actors**:
  - Retrieve all actors or a specific actor by ID.
  - Fetch films for a specific actor.
- **Films**:
  - Retrieve all films or a specific film by ID.
  - Fetch actors appearing in a specific film.
- **Customers**:
  - Retrieve all customers or a specific customer by ID.
- **Stores**:
  - Retrieve all stores or a specific store by ID.
- **Inventory**:
  - Check film availability in store inventory.

### MongoDB Integration:
- **Movies**:
  - Search movies by genre, director, or year.
- **Colors Collection**:
  - Perform CRUD operations (Create, Read, Update, Delete) on color data.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web application framework.
- **MySQL**: Relational database for `sakila` schema.
- **MongoDB**: NoSQL database for `sample_mflix` and `cs480_project2` collections.

---

## Setup Instructions

### Prerequisites:
- Node.js installed on your system.
- MySQL server with the `sakila` database.
- MongoDB instance with `sample_mflix` and `cs480_project2` databases.

### Installation:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure database credentials in `index.js`:
   - Update the MySQL connection details (`host`, `user`, `password`, `database`).
   - Update MongoDB URI.

4. Start the server:
   ```bash
   node index.js
   ```

5. Access the server at `http://localhost:3000`.

---

## API Endpoints

### MySQL Endpoints:
- **Actors**:
  - `GET /api/v1/actors`: Fetch all actors.
  - `GET /api/v1/actors/:id`: Fetch actor by ID.
  - `GET /api/v1/actors/:id/films`: Fetch films for a specific actor.
- **Films**:
  - `GET /api/v1/films`: Fetch all films.
  - `GET /api/v1/films/:id`: Fetch film by ID.
  - `GET /api/v1/films/:id/actors`: Fetch actors in a specific film.
- **Customers**:
  - `GET /api/v1/customers`: Fetch all customers.
  - `GET /api/v1/customers/:id`: Fetch customer by ID.
- **Stores**:
  - `GET /api/v1/stores`: Fetch all stores.
  - `GET /api/v1/stores/:id`: Fetch store by ID.
- **Inventory**:
  - `GET /api/v1/inventory-in-stock/:film_id/:store_id`: Check film inventory.

### MongoDB Endpoints:
- **Movies**:
  - `GET /api/v1/movies`: Search movies by genre, director, or year.
- **Colors**:
  - `GET /api/v1/colors`: Fetch all color documents.
  - `POST /api/v1/colors`: Add a new color document.
  - `GET /api/v1/colors/:id`: Fetch a color document by ID.
  - `PUT /api/v1/colors/:id`: Update a color document by ID.
  - `DELETE /api/v1/colors/:id`: Delete a color document by ID.

---

## Dependencies

The project uses the following npm packages:
- `express`: Web framework for building RESTful APIs.
- `mysql2`: MySQL driver for Node.js.
- `mongodb`: MongoDB client for Node.js.
- `cors`: Middleware for enabling CORS.

Check `package.json` for the full list of dependencies.

---

## License

This project is licensed under the ISC License.
