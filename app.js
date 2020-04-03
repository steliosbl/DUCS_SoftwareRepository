const express = require('express');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: path.join(__dirname, 'public') });
});

module.exports = app;
