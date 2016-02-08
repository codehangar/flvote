var r = require('rethinkdb'),
	fs = require('fs'),
	connectionInfo;

var RethinkDbService = function() {

};

/**
 * Generate a RethinkDB database connection
 * @returns {Promise}
 */
RethinkDbService.prototype.getConnection = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		fs.readFile('./cacert', function(err, caCert) {
			// TODO - We need to move from compose.io to our own DO Box
			// This is required for now to switch between using ssl or not for local vs prod until then
			if(process.env.NODE_ENV === 'local') {
				connectionInfo = {
							host: process.env.DATABASE_HOST,
							port: process.env.DATABASE_PORT,
							db: process.env.DATABASE_NAME
						};
			}

			if(process.env.NODE_ENV === 'production') {
				connectionInfo = {
							host: process.env.DATABASE_HOST,
							port: process.env.DATABASE_PORT,
							authKey: process.env.DATABASE_KEY,
							db: process.env.DATABASE_NAME,
							ssl: {
								ca: caCert
							}
						};
			}
			r.connect(connectionInfo).then(function(conn) {
				resolve(conn);
			}).catch(function(err) {
				reject(err);
			});
		});
	});
}

module.exports = new RethinkDbService();
