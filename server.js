'use strict';

try {
  // Loads environment settings from '.env' into process.env
  // This is for local development
  require('dotenv').load();
} catch (e) {
  console.log('.env file not found')
}

var express = require('express');
var Twitter = require('twitter');
var Apicache = require('apicache');
var cache = Apicache.middleware;

var app = express();

/** Add proper headers for CORS support for an Express application */
function CORSHeaders(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept, *");
  next();
}

/** enable CORS support */
app.use(CORSHeaders);

/** health check route */
app.get('/health', function (req, res) {
  res.status(200).send('ok');
});

/** twitter api proxy */
app.get('/api/twitter/1.1/*', cache('3 minutes'), function (req, res) {

  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var params = req.query;
  params.count = true;

  client.get(req.params[0], params, function (error, tweets, response) {
    res.status(response.statusCode).send(tweets);
  });

});

/** Static Files */
app.use('/', express.static(__dirname + '/src/public'));

/** This route deals enables HTML5Mode by forwarding missing files to the index.html */
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/src/public/index.html')
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  console.log('listening on port: %s', port);
});

module.exports = app;