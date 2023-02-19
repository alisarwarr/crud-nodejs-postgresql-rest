const express = require('express');
const { Pool } = require('pg');



const app = express();
app.use(express.json());



// Initialize a PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres9596',
    port: 5432
});



// Define the endpoints for the REST API
app.get('/users', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(rows[0]);
});

app.post('/users', async (req, res) => {
    const { id, name, email } = req.body;
    const { rows } = await pool.query('INSERT INTO users(id, name, email) VALUES($1, $2, $3) RETURNING *', [id, name, email]);
    res.json(rows[0]);
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const { rows } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    res.json(rows[0]);
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    res.json(rows[0]);
});



// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});