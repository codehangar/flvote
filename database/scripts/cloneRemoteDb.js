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
		RethinkDbService = require('../../src/services/RethinkDbService.js'),
		prompt = require('prompt'),
		chalk = require('chalk'),
		remoteConn,
		localConn,
		database,
		remoteDatabases,
		localDatabases,
		remoteTables,
		remoteData;

co(function *() {

	// Lets get a database connection
	remoteConn = yield RethinkDbService.getConnection(process.env.DATABASE_REMOTE_HOST, process.env.DATABASE_REMOTE_PORT, process.env.DATABASE_REMOTE_KEY);

	remoteDatabases = yield r.dbList().run(remoteConn);

	console.log(chalk.yellow('The remote database server has the following rethinkdb databases: '), chalk.cyan(remoteDatabases));
	console.log(chalk.yellow('Choose a database to clone'));

	prompt.start();

	// Prompt user which database to clone
	prompt.get(['database'], function(err, input) {
		if(err) {
			console.log(err);
			process.exit();
		}
		// Make sure input matched a database
		if(remoteDatabases.indexOf(input.database) !== -1) {
			co(function *() {
				database = input.database;
				localConn = yield RethinkDbService.getConnection();
				localDatabases = yield r.dbList().run(localConn);
				// If local database exists of the remote user is cloning lets prompt to make sure they want to delete and override
				if(localDatabases.indexOf(database) !== -1) {
					console.log(chalk.red('This database exists already locally, would you like to override it?'));
					prompt.start();
					prompt.get(['yes/no'], function(err, input) {
						if(err) {
							console.log(err);
							process.exit();
						}
						if(input['yes/no'] === 'yes') {
							r.dbDrop(database).run(localConn, function(err, results) {
								if(err) {
									console.log(err);
									process.exit();	
								}
								cloneDatabase(database, remoteConn, localConn);
							});
						} else if(input['yes/no'] === 'no') {
							console.log(chalk.red('aborting'));
							process.exit();
						} else {
							process.exit();
						}
					});
				} else {
					cloneDatabase(database, remoteConn, localConn);
				}
			}).catch(function(err) {
				console.log(err);
				process.exit();
			});
		} else {
			console.log(chalk.red('your choice was not a valid database'));
			process.exit();
		}
	});

}).catch(function(err) {
	console.log(err);
	process.exit();
});

function cloneDatabase(db, remoteConn, localConn) {
	co(function *() {
		var tableInfo;
		// Lets create the db if not exists
		yield RethinkDbService.createDb(localConn, db);
		// Lets get all the tables in the remote db
		remoteTables = yield r.db(db).tableList().run(remoteConn);
		// Loop over tables and create them on local along with any keys
		for(var i = 0; i < remoteTables.length; i++) {
			tableInfo = yield r.db(db).table(remoteTables[i]).indexList().run(remoteConn);
			// Lets create any tables that do not exist
			yield RethinkDbService.createTable(localConn, database, remoteTables[i], 'id');
			// Loop over any secondary keys that need to be made
			for(var ii = 0; ii < tableInfo.length; ii++) {
				// Lets create any indices that do not exist
				yield RethinkDbService.createIndex(localConn, database, remoteTables[i], tableInfo[ii]);
			}
			// fill up tables with remote data
			remoteData = yield r.db(db).table(remoteTables[i]).run(remoteConn);
			remoteData = yield remoteData.toArray();
			yield r.db(db).table(remoteTables[i]).insert(remoteData).run(localConn);
			console.log('Remote data successfully inserted into: ' + remoteTables[i]);
		}
		yield localConn.close();
		yield remoteConn.close();
		console.log(chalk.green(db + ' successfully cloned to your local database!!'));
		process.exit();
	}).catch(function(err) {
		console.log(err);
		process.exit();
	});
}

