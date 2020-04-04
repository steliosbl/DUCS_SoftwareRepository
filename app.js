// Import express and other packages
const express = require('express');
const path = require('path');

const programsRouter = require('./routes/programs');
const imagesRouter = require('./routes/images');

const morgan = require('morgan');

// Initialize app
const app = express();

// Initialize logging
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, "public")));
// Set JSON encoding
app.use(express.json());

// Common responses
app.use((req, res, next) => {
  res.notfound = () => {
    res.status(404).json({
      error: '404'
    });
  };

  res.invalid = (err = '400') => {
    res.status(404).json({
        error: err
      });
  };

  next();
});

app.use('/programs', programsRouter);
app.use('/images', imagesRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: path.join(__dirname, 'views') });
});

app.get('*', (req, res) => {
  res.notfound();
});

module.exports = app;
