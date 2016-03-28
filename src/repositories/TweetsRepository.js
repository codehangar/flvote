var RethinkDbService = require('../services/RethinkDbService.js'),
		r = require('rethinkdb'),
		co = require('co');

var TweetsRepository = function() {

};

/**
 * Insert one or many tweets into the database
 * @param {Mixed} Single tweet object or an array of tweet objects
 * @returns {Promise}
 */
TweetsRepository.prototype.insertTweets = function(tweets) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			// Open a db connection
			try {
				var conn = yield RethinkDbService.getDatabaseConnection();
			} catch(e) {
				reject(e);
			}
			// Insert tweets into db
			try {
				var results = r.table('tweets').insert(tweets).run(conn);
			} catch(e) {
				reject(e);
			}
			resolve(results);
		}).catch(function(err) {
			reject(err);
		});
	});
};

module.exports = new TweetsRepository();