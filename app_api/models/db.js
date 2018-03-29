var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/TEC';

// Connect to MongoDB server
mongoose.connect(dbURI);

// Monitoring MongoDB connection events.
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

// Disconnect to the MongoDB when the application is shut down or restarted.
var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// Listen for shutdown from nodemon.
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// Listen for shutdown from application.
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});
// Listen for shutdown from Heroku.
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});

require('./personalTaxRecords');
require('./taxRates');
