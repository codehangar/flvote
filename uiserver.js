'use strict';

var express = require('express');
var app = express();

/** Static Files */
app.use('/', express.static(__dirname + '/src'));

/** This route deals enables HTML5Mode by forwarding missing files to the index.html */
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/src/index.html')
});

var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
  console.log('listening on port: %s', port);
});

module.exports = app;

