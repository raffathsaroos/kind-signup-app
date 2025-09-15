const request = require('supertest');
const express = require('express');
const { Client } = require('pg');

// Import your existing server code
const app = express();
app.use(express.json());

// Use a test database or same DB (be careful with production data)
const client = new Client({
  host: 'postgres',
  user: 'user',
  password: 'password',
  database: 'mydatabase',
});

client.connect();

// Replicate the endpoints from server.js
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *',
      [username, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error during signup');
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Success', user: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).send('Error during signin');
  }
});

afterAll(() => {
  client.end();
});

describe('Auth Endpoints', () => {

  const testUser = {
    username: 'testuser',
    password: '1234'
  };

  test('Signup should create a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', testUser.username);
  });

  test('Signin with correct credentials should return 200', async () => {
    const res = await request(app)
      .post('/signin')
      .send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Success');
  });

  test('Signin with wrong credentials should return 401', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

});
