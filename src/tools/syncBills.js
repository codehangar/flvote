'use strict';

try {
  // Loads environment settings from '.env' into process.env
  // This is for local development
  require('dotenv').load();
} catch (e) {
  console.log('.env file not found')
}

var r = require('rethinkdb');

/* Make database connection */
var conn = r.connect({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	db: process.env.DATABASE_NAME
});

conn.then(function(db) {
  /* Setup api request params and url */
	var requestParams = {
      apikey: '932407d3-d4bd-4beb-8cd2-f4356036b6fc',
      legislative_session: '2016'
    },
    requestUrl = 'https://www.tabsontallahassee.com/api/bills/';

  /* Use RethinkDB http client to scrap api */
  r.http(requestUrl, {
    params: requestParams,
    page: function(info) { // This function wants a string of the next request while scraping
    	return info('body')('links')('next').default(null);
    },
    pageLimit: -1, // -1 will let it iterate over requests until the page function returns null
    resultFormat: 'json'
	})
  .run(db, function(err, results) {
    /* This is returning a lazy loaded stream object */
    /* RethinkDB gives various operations we can chain to the stream/cursor object */
    results.each(function(err, row) {
      /* Row is representing the body of each api request */
      /* This is a page worth of the tabs on tally api, which is a max of 50 bills at a time */
      /* R.expr lets us chain rethinkDB methods on the json data */
      /* Here we are grabbing the data field from the tabs on tally body and bulk inserting the bills */
    	r.expr(row)
  			.getField('data')
				.orderBy('id')
				.run(db, function(err, results) {
					r.table("bills").insert(results, {conflict: 'update'}).run(db, function(err, results) {
            console.log(results);
          });
				});
    });
  });

}).catch(function(err) {
  console.log(err);
});