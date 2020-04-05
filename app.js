// Import express and other packages
const express = require('express');
const path = require('path');

const errors = require('./errors');

const programRouter = require('./routes/program');
const imageRouter = require('./routes/image');
const authorRouter = require('./routes/author');

const morgan = require('morgan');

// Initialize app
const app = express();

// Initialize logging
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));
// Set JSON encoding
app.use(express.json());

// Common responses
app.use(errors);

app.use('/program', programRouter);
app.use('/image', imageRouter);
app.use('/author', authorRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: path.join(__dirname, 'views') });
});

app.get('*', (req, res) => {
  res.respond.notfound();
});

module.exports = app;
