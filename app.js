var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var fs = require('fs');

// Connecting to the database.
require('./app_api/models/db');

var routesApi = require('./app_api/routes/index');

var app = express();

// Generate minify tex.min.js from angular javascript sources.
var appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/history/history.controller.js',
  'app_client/common/directives/navigation/navigation.directive.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js',
  'app_client/common/directives/footerGeneric/footerGeneric.directive.js'
];
var code = appClientFiles.map(function (file) {
  return fs.readFileSync(file, 'utf8');
});
var uglified = uglifyJs.minify(code, { compress : false });
fs.writeFile('public/angular/tec.min.js', uglified.code, function (err){
  if(err) {
     console.log(err);
  } else {
    console.log('Script generated and saved: tec.min.js');
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

// Define api routes.
app.use('/api', routesApi);

// If no URL requests are matched, send back index.html.
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
