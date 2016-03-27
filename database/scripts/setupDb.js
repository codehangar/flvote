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

	var database = process.env.DATABASE_NAME;
	// Lets get a database connection
	var conn = yield RethinkDbService.getConnection();
	// Lets create the db if not exists
	yield RethinkDbService.createDb(conn, database);
	// Lets create any tables that do not exist
	yield RethinkDbService.createTable(conn, database, 'bills', 'id');
	yield RethinkDbService.createTable(conn, database, 'tweets', 'id');
	yield RethinkDbService.createTable(conn, database, 'votes', 'id');
	// Lets create any indices that do not exist
	yield RethinkDbService.createIndex(conn, database, 'votes', 'billIdentifier');
	console.log('Database successfully setup!');
	conn.close();
	process.exit();

}).catch(function(err) {
	console.log(err);
});

