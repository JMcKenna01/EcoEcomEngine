require('dotenv').config();

// Import Sequelize connection
const sequelize = require('./config/connection'); // Adjust the path as needed

const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Sync Sequelize models to the database, then start the server
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch(err => {
    console.error('Sequelize sync failed:', err);
  });
