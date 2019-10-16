const mongoose = require('mongoose');
const { logger } = require('../utils');

mongoose.Promise = global.Promise;


const options = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  useNewUrlParser: true,
};

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME) {
  console.log(process.env.DB_NAME, process.env.DB_PORT, process.env.DB_HOST)
  logger.error('Please set DB_HOST, DB_PORT, DB_NAME');
  process.exit(-1);
}

const connectionString = (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) ? 
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` : 
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(connectionString, options);

// mongoose.connect(process.env.MONGODB_URI, {
//   auth: {
//     user: username,
//     password: password
//   },
//   options,
// });

mongoose.connection.on('connected', () => {
  logger.info('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
  logger.error('MongoDB disconnected');
});

module.exports = mongoose;
