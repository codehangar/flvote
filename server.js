'use strict';

try {
  // Loads environment settings from '.env' into process.env
  // This is for local development
  require('dotenv').load();
} catch (e) {
  console.log('.env file not found')
}

var express = require('express');
var request = require('request');
var TwitterService = require('./TwitterService');

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

/** health check route */
app.get('/1.1/*', function (req, res) {

  var options = {
    url: 'https://api.twitter.com/1.1/' + req.params[0],
    headers: {
      'Authorization': 'Bearer 23995804-7niWvZc1CbruQwUSv0CDbT6zlOlvMEvUQpCdl2TU2'
    },
    qs: req.query
  };

  //console.log('req', req);
  //console.log('options.url', options.url);
  //console.log('req.baseUrl', req.baseUrl);
  //console.log('req.params', req.params);
  //console.log('req.query', req.query);

  request(options, function (e, r, body) {
    //console.log('e', e);
    //console.log('r', r);
    //console.log('body', body);
    res.status(r.statusCode).send(body);
  });


  // Get OAuth Object, we need to pass in the authorize redirect for later
  //TwitterService.initTwitterOauth('http://localhost:8080/health')
  //  .then(function (oa) {
  //    console.log('oa', oa);
  //    var authorizeUrl = "https://twitter.com/oauth/authorize?oauth_token="; // add this back after testing - force_login=true&
  //
  //    // Need to grab app access tokens for the authorize redirect
  //    TwitterService.getOAuthRequestToken(oa).then(function (tokens) {
  //      // This will actually send the user to twitter to authorize
  //      res.send(tokens);
  //      //res.redirect(authorizeUrl + tokens.oauthToken);
  //    }).catch(function (err) {
  //      res.status(500);
  //      res.json(err);
  //    });
  //  }).catch(function (err) {
  //  console.log('err', err);
  //  res.status(500);
  //  res.json(err);
  //});
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  console.log('listening on port: %s', port);
});

module.exports = app;