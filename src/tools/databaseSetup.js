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
		fs = require('fs'),
		connectionInfo;

// TODO - We need to move from compose.io to our own DO Box
// This is required for now to switch between using ssl or not for local vs prod until then
if(process.env.NODE_ENV === 'local') {
	connectionInfo = {
				host: process.env.DATABASE_HOST,
				port: process.env.DATABASE_PORT
			};
}

if(process.env.NODE_ENV === 'production') {
	connectionInfo = {
				host: process.env.DATABASE_HOST,
				port: process.env.DATABASE_PORT,
				authKey: process.env.DATABASE_KEY,
				ssl: {
					ca: caCert
				}
			};
}

/* Make database connection */
function dbConnection() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./cacert', function(err, caCert) {
			r.connect(connectionInfo).then(function(conn) {
				resolve(conn);
			}).catch(function(err) {
				reject(err);
			});
		});
	});
}

/* Create the flvote db if it does not exist */
function createDb(conn) {
	return new Promise(function(resolve, reject) {
		r.dbList().run(conn, function(err, results) {
			if(err) {
				console.log(err);
				reject(err);
			} else {
				if(results.indexOf('flvote') === -1) {
					/* Lets create the flvote db */
					r.dbCreate('flvote').run(conn, function(err, results) {
						resolve(true);
					});
				} else {
					resolve(true);
				}
			}
		});
	});
}

/* Create any tables that do not exist */
function createTables(conn) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			// We will store table create promises here and execute them in parallel
			var tables = [];

			// Get a list of database tables
			try {
				var dblist = yield r.db('flvote').tableList().run(conn);
			} catch(e) {
				reject(e);
			}

			// If tables do not exist in dblist array then create the tables
			// Push the promises of creating the table into tables array
			if(dblist.indexOf('bills') === -1) {
				tables.push(r.db('flvote').tableCreate('bills').run(conn));
			}
			if(dblist.indexOf('tweets') === -1) {
				tables.push(r.db('flvote').tableCreate('tweets').run(conn));
			}
			if(dblist.indexOf('votes') === -1) {
				tables.push(r.db('flvote').tableCreate('votes').run(conn));
			}

			// Wait for all table creates to execute and resolve
			try {
				yield tables;
			} catch(e) {
				reject(e);
			}

			resolve(true);

		}).catch(function(err) {
			reject(err);
		});
	});
}

/* Create any tables that do not exist */
function createIndices(conn) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			// We will store indices create promises here and execute them in parallel
			var indices = [];

			try {
				indices.push(r.db('flvote').table('votes').indexCreate('billIdentifier').run(conn));
			} catch(e) {

			}

			// Wait for all table creates to execute and resolve
			try {
				yield indices;
			} catch(e) {
				reject(e);
			}

			resolve(true);

		}).catch(function(err) {
			reject(err);
		});
	});
}

co(function *() {

	// Lets get a database connection
	try {
		var conn = yield dbConnection();
	} catch(e) {
		console.log(e);
		console.log('Failed connecting to db!');
		process.exit();
	}

	// Lets create the flvot db if not exists
	try {
		yield createDb(conn);
	} catch(e) {
		console.log(e);
	}

	// Lets create any tables that do not exist
	try {
		yield createTables(conn);
	} catch(e) {
		console.log(e);
	}

	// Lets create any tables that do not exist
	try {
		yield createIndices(conn);
	} catch(e) {
		console.log(e);
	}

	console.log('Database successfully setup!');
	process.exit();

}).catch(function(err) {
	console.log(err);
});

