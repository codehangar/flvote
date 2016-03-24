var r = require('rethinkdb'),
    fs = require('fs'),
    connectionInfo = {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        db: process.env.DATABASE_NAME
    };

var RethinkDbService = function() {

};

/**
 * Generate a RethinkDB database connection
 * @returns {Promise}
 */
RethinkDbService.prototype.getConnection = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        r.connect(connectionInfo).then(function(conn) {
            resolve(conn);
        }).catch(function(err) {
            reject(err);
        });
    });
}

module.exports = new RethinkDbService();
