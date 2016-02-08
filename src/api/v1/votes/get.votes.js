var VotesRepository = require('../../../repositories/VotesRepository.js'),
	co = require('co');

/**
 * Return a single vote object
 * @param {Object} Express Request Object
 * @param {Object} Express Response Object
 * @returns {Promise}
 */
var getVotes = function(req, res) {
	var errors = {
		code: 0,
		errors: {}
	},
	billIdentifier = [req.params.billIdentifier],
	results = [];

	co(function *() {

		try {
			results = yield VotesRepository.listVotes(billIdentifier);	
		} catch(e) {
			errors.code = 500;
			errors.errors.votes = e.stack;
			res.status(errors.code);
			res.json(errors);
		}

		if(results.length) {
			res.status(200);
			res.json(results[0]);
		} else {
			res.sendStatus(404);
		}

	}).catch(function(err) {
		errors.code = 500;
		errors.errors.votes = err.stack;
		res.status(errors.code);
		res.json(errors);
	});
};

module.exports = getVotes;