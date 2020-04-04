// Import express and other packages
const express = require('express');
const path = require('path');

const programRouter = require('./routes/programs');

const morgan = require('morgan');

// Initialize app
const app = express();

// Initialize logging
app.use(morgan('tiny'));

// app.use(express.static(path.join(__dirname, "public")));
// Set JSON encoding
app.use(express.json());

// Common responses
app.use((req, res, next) => {
  res.notfound = () => {
    res.status(404).json({
      error: '404'
    });
  };

  res.invalid = () => {
    res.status(404).json({
        error: '400'
      });
  };

  next();
});

app.use('/programs', programRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: path.join(__dirname, 'views') });
});

app.get('*', (req, res) => {
  res.notfound();
});

module.exports = app;
