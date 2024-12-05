const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');

const app = express();

// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

//Routes
app.use('/auth', authRoutes);
app.use('/verify', verifyRoutes);

//Health Check
app.get('/', (req, res) => {
    res.send('SpotAuth-Lite is running!');
});

module.exports = app;
