// Import express and other packages
const express = require('express');
const path = require('path');

const programRouter = require('./routes/programs');

// Constants used for responses
const NOTFOUND = {
  error: '404'
};
const INVALID = {
  error: '400'
};

const morgan = require('morgan');

// Initialize app
const app = express();

// Initialize logging
app.use(morgan('tiny'));

// app.use(express.static(path.join(__dirname, "public")));
// Set JSON encoding
app.use(express.json());

app.use('/programs', programRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.get('*', (req, res) => {
  res.status(404).json(NOTFOUND);
});

module.exports = app;
