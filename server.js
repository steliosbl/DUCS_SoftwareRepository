// Import app from its own file
const app = require('./app');

// SET the port here
const port = process.env.PORT || '8000';

// Database dependencies
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// Initialize database, pass it to request context, then launch app
const adapter = new FileAsync('.data/db.json');

lowdb(adapter)
  .then(db => {
    app.set('db', db);
    return db.defaults().write();
})
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
});
