const express = require('express');
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');

const app = express();
app.use(express.json());


//Routes
app.use('/auth', authRoutes);
app.use('/verify', verifyRoutes);

//Health Check
app.get('/', (req, res) => {
    res.send('SpotAuth-Lite is running!');
});

module.exports = app;
