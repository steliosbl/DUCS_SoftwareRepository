// Import app from its own file
const app = require('./app');

// Import database
const db = require('./db');

// SET the port here
const port = process.env.PORT || '8000';

// Build the required directory structure
const bds = require('./directories');
bds();

db.connect(app).then(() => {
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
});
