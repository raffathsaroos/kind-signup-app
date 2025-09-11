const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Database connection configuration
const client = new Client({
  host: 'postgres',
  user: 'user',
  password: 'password',
  database: 'mydatabase',
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING *', [username, password]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error during signup');
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
