const express = require("express");
const mysql = require("mysql2/promise");
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const mysqlPool = mysql.createPool({
  host: "34.28.223.34",
  user: "dhayes1",
  password: "ckaw9704",
  database: "sakila",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// MongoDB connection URI
const mongoUri = 'mongodb+srv://ckawl:chin1234@cluster0.hyljd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoClient = new MongoClient(mongoUri);

let dbs = {}; // Object to store connected databases

// Connect to both databases
(async () => {
  try {
    await mongoClient.connect();
    dbs.sample_mflix = mongoClient.db('sample_mflix');
    dbs.cs480_project2 = mongoClient.db('cs480-project2');
    console.log('Connected to MongoDB databases: sample_mflix and cs480_project2');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
})();

// Utility Functions
const handleError = (res, error) => {
  console.error(error);
  res.json(["An error has occurred."]);
};

// GET all actors
app.get("/api/v1/actors", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM actor");
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
});

// GET actor by ID
app.get("/api/v1/actors/:id", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM actor WHERE actor_id = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET all films
app.get("/api/v1/films", async (req, res) => {
  try {
    const query = req.query.query ? `%${req.query.query.toLowerCase()}%` : "%";
    const [rows] = await mysqlPool.query(
      "SELECT * FROM film WHERE LOWER(title) LIKE ?",
      [query],
    );
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
});

// GET film by ID
app.get("/api/v1/films/:id", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM film WHERE film_id = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET all customers
app.get("/api/v1/customers", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM customer");
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
});

// GET customer by ID
app.get("/api/v1/customers/:id", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM customer WHERE customer_id = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET all stores
app.get("/api/v1/stores", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM store");
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
});

// GET store by ID
app.get("/api/v1/stores/:id", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM store WHERE store_id = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET films for an actor
app.get("/api/v1/actors/:id/films", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      `SELECT f.* FROM film f
       INNER JOIN film_actor fa ON f.film_id = fa.film_id
       WHERE fa.actor_id = ?`,
      [req.params.id],
    );
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
});

// GET actors in a film
app.get("/api/v1/films/:id/actors", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      `SELECT a.* FROM actor a
       INNER JOIN film_actor fa ON a.actor_id = fa.actor_id
       WHERE fa.film_id = ?`,
      [req.params.id],
    );
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
});

// GET a row from film_list by ID
app.get("/api/v1/films/:id/detail", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM film_list WHERE FID = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET a row from customer_list by ID
app.get("/api/v1/customers/:id/detail", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM customer_list WHERE ID = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET a row from actor_info by ID
app.get("/api/v1/actors/:id/detail", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM actor_info WHERE actor_id = ?",
      [req.params.id],
    );
    res.json(rows[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET inventory in stock
app.get('/api/v1/inventory-in-stock/:film_id/:store_id', async (req, res) => {
  try {
    const [results] = await mysqlPool.query('CALL film_in_stock(?, ?,@count)', [req.params.film_id, req.params.store_id]);
    res.json(results[0] || []);
  } catch (error) {
    handleError(res, error);
  }
});

// GET /movies endpoint
app.get('/api/v1/movies', async (req, res) => {
  try {
    const query = {};

    // Dynamically build query from query parameters
    if (req.query.genre) {
      query.genres = req.query.genre; // Match on genre
    }
    if (req.query.year) {
      query.year = parseInt(req.query.year, 10); // Match on year (convert to integer)
    }
    // Map 'director' query param to the correct 'directors' field in the database
    if (req.query.director) {
      query.directors = { $regex: new RegExp(req.query.director, 'i') }; // Case-insensitive match
    }

    // Fetch documents from the movies collection with a limit of 10
    const movies = await dbs.sample_mflix.collection('movies').find(query).limit(10).toArray();

    res.json(movies); // Send the fetched documents as JSON
  } catch (error) {
    console.error(error);
    res.json(["An error has occurred."]); // Return error response if something goes wrong
  }
});

// GET: Return all documents in the "colors" collection
app.get('/api/v1/colors', async (req, res) => {
  try {
    const colors = await dbs.cs480_project2.collection('colors').find().toArray();
    res.json(colors);
  } catch (error) {
    console.error(error);
    res.json(["An error has occurred."]);
  }
});

// POST: Insert a new document into the "colors" collection
app.post('/api/v1/colors', async (req, res) => {
  try {
    const result = await dbs.cs480_project2.collection('colors').insertOne(req.body);
    res.json(result); // Return the result of the insertion
  } catch (error) {
    console.error(error);
    res.json(["An error has occurred."]);
  }
});

// GET: Return a single document by ID
app.get('/api/v1/colors/:id', async (req, res) => {
  try {
    const color = await dbs.cs480_project2.collection('colors').findOne({ _id: new ObjectId(req.params.id) });
    res.json(color || []); // Return the document or an empty array if not found
  } catch (error) {
    console.error(error);
    res.json(["An error has occurred."]);
  }
});

// PUT: Update a document by ID
app.put('/api/v1/colors/:id', async (req, res) => {
  try {
    const result = await dbs.cs480_project2.collection('colors').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result); // Return the result of the update
  } catch (error) {
    console.error(error);
    res.json(["An error has occurred."]);
  }
});

// DELETE: Delete a document by ID
app.delete('/api/v1/colors/:id', async (req, res) => {
  try {
    const result = await dbs.cs480_project2.collection('colors').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result); // Return the result of the deletion
  } catch (error) {
    console.error(error);
    res.json(["An error has occurred."]);
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
