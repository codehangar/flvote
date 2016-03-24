var VotesRepository = require('../../../repositories/VotesRepository.js'),
	co = require('co');

/**
 * Return a list of all votes unless specific billIdentifiers are sent
 * @param {Object} Express Request Object
 * @param {Object} Express Response Object
 * @returns {Promise}
 */
var listVotes = function(req, res) {
	var errors = {
		code: 400,
		errors: {}
	},
	billIdentifiers = req.query.billIdentifiers ? req.query.billIdentifiers.split(',') : null,
	results = [];

	co(function *() {

		try {
			results = yield VotesRepository.listVotes(billIdentifiers);	
		} catch(e) {
			errors.code = 500;
			errors.errors.votes = e.stack;
			res.status(errors.code);
			res.json(errors);
		}

		// Lets slug in any missing votes for any query parameters passed
		if(billIdentifiers) {
			for(var i = 0; i < results.length; i++) {
				billIdentifiers.splice(billIdentifiers.indexOf(results[i].billIdentifier), 1);
			}
			for(var i = 0; i < billIdentifiers.length; i++) {
				results.push({
					billIdentifier: billIdentifiers[i],
					created_date: new Date(),
					id: null,
					no: 0,
					yes: 0
				});
			}
		}	

		res.status(200);
		res.json(results);

	}).catch(function(err) {
		errors.code = 500;
		errors.errors.votes = err.stack;
		res.status(errors.code);
		res.json(errors);
	});
};

module.exports = listVotes;