'use strict';

try {
  // Loads environment settings from '.env' into process.env
  // This is for local development
  require('dotenv').load();
} catch (e) {
  console.log('.env file not found')
}

var r = require('rethinkdb'),
		co = require('co'),
		RethinkDbService = require('../../src/services/RethinkDbService.js');

co(function *() {

	// Generate and set database authKey
	yield RethinkDbService.generateAuthKey();
	process.exit();

}).catch(function(err) {
	console.log(err);
});

