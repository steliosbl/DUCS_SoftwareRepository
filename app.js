// Import express and other packages
const express = require('express');
const path = require('path');
var HttpStatus = require('http-status-codes');

const jsonErrorHandler = require('./middleware/jsonErrorHandler');

const programRouter = require('./routes/program');
const imageRouter = require('./routes/image');
const authorRouter = require('./routes/author');

const morgan = require('morgan');

// Initialize app
const app = express();

// Initialize logging
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
// Set JSON encoding
app.use(express.json());

app.use('/program', programRouter);
app.use('/image', imageRouter);
app.use('/author', authorRouter);

app.get('/', (req, res) => {
  res.status(HttpStatus.OK)
    .sendFile('index.html', {
      root: path.join(__dirname, 'views')
    });
});

app.get('*', (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    errors: ['Not found']
  });
});

app.use(jsonErrorHandler);

module.exports = app;
