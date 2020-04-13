// Import express and other packages
const express = require('express');
const path = require('path');
const HttpStatus = require('http-status-codes');
const morgan = require('morgan');

// Import middleware
const jsonErrorHandler = require('./middleware/jsonErrorHandler');

// Import routers
const programRouter = require('./routes/program');
const imageRouter = require('./routes/image');
const authorRouter = require('./routes/author');

// Initialize app
const app = express();

// Initialize error handling
app.use(jsonErrorHandler);

// Initialize logging only if the app is not being tested with jest
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Set JSON encoding
app.use(express.json());

// Initialize paths
app.use(express.static(path.join(__dirname, 'public')));
app.use('/program', programRouter);
app.use('/image', imageRouter);
app.use('/author', authorRouter);

// Redirect root path to index.html
app.get('/', (req, res) => {
  res.status(HttpStatus.OK)
    .sendFile('index.html', {
      root: path.join(__dirname, 'views')
    });
});

// Redirect all non-matching GETs to custom 404
app.get('*', (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    errors: ['Not found']
  });
});

module.exports = app;
