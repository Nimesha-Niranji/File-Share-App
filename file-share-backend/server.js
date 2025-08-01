//servers.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

const sequelize = require('./config/db');
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
});


sequelize.sync().then(() => {
  app.listen(5000, () => console.log('Server started on port 5000'));
});
