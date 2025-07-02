const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secret-key', // 🔐 change this in production
  resave: false,
  saveUninitialized: true,
}));

const asanaRoutes = require('./asana');
app.use('/asana', asanaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
