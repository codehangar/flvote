var RethinkDbService = require('../services/RethinkDbService.js'),
		r = require('rethinkdb'),
		co = require('co');

var VotesRepository = function() {

};

/**
 * Upsert Vote Object
 * @param {Object} Vote Object
 * @returns {Promise}
 */
VotesRepository.prototype.upsertVote = function(vote) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			// Open a db connection
			try {
				var conn = yield RethinkDbService.getDatabaseConnection();
			} catch(e) {
				reject(e);
			}
			// Upsert Vote object
			// TODO - Figure out how to do this in one statement
			// We need to check if record exists for billIdentifer
			try {
				var results = yield r.table('votes').getAll(vote.billIdentifier, {index: 'billIdentifier'}).run(conn);
					results = yield results.toArray(); // This type of query returns a cursor, so we need to cast to array
			} catch(e) {
				reject(e);
			}

			// Determine if a match was found
			if(results.length) {
				try {
					yield r.table('votes').get(results[0].id).update({
					  yes: r.row('yes').add(vote.yes),
					  no: r.row('no').add(vote.no)
					}).run(conn);
				} catch(e) {
					reject(e)
				}
			} else {
				// If not then make intial record with yes/no accordingly
				try {
					yield r.table('votes').insert(vote).run(conn);
				} catch(e) {
					reject(e)
				}
			}
			resolve(true);
			
		}).catch(function(err) {
			reject(err);
		});
	});
};

/**
 * Get a list of all vote records
 * @returns {Promise}
 */
VotesRepository.prototype.listVotes = function(billIdentifiers) {
	var results = [];
	return new Promise(function(resolve, reject) {
		co(function *() {
			// Open a db connection
			try {
				var conn = yield RethinkDbService.getDatabaseConnection();
			} catch(e) {
				reject(e);
			}
			// Query all votes
			if(!billIdentifiers) {
				try {
					results = yield r.table('votes').run(conn);
					results = yield results.toArray();
				} catch(e) {
					reject(e);
				}
			} else {
				// Query for billIdentifiers
				try {
					results = yield r.table('votes').getAll(r.args(billIdentifiers), {index: 'billIdentifier'}).run(conn);
					results = yield results.toArray();
				} catch(e) {
					reject(e);
				}
			}
			resolve(results);
		}).catch(function(err) {
			reject(err);
		});
	});
};

module.exports = new VotesRepository();