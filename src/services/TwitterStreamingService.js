var Twit = require('twit'),
    co = require('co'),
    TweetsRepository = require('../repositories/TweetsRepository.js'),
    VotesRepository = require('../repositories/VotesRepository.js'),
    r = require('rethinkdb'),
    RethinkDbService = require('./RethinkDbService.js');

var TwitterStreamingService = function() {
  this.twit = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  });
};

/**
 * Generate a twitter stream using the POST status/filter endpoint
 * @returns {Promise}
 */
TwitterStreamingService.prototype.getFilterStream = function() {
  return this.twit.stream('statuses/filter', { track: 'flvote' });
};

/**
 * Start the twitter stream and setup listeners
 */
TwitterStreamingService.prototype.startStream = function() {
  // Get filter stream
  var _this = this,
      stream = this.getFilterStream();
  
  // Listening for tweet events from the stream
  stream.on('tweet', function(tweet) {
    _this.handleTweet(tweet);
  });

  // Listening for tweet events
  stream.on('error', function(err) {
    _this.handleError(err);
  });

  // Listening for tweet events
  stream.on('delete', function(tweet) {
    _this.handleDelete(tweet);
  });

};

/**
 * Handle tweet events
 * @param {Object} Tweet Object
 */
TwitterStreamingService.prototype.handleTweet = function(tweet) {
  var _this = this;
  co(function *() {
    // Insert Tweet
    try {
      var results = yield TweetsRepository.insertTweets(tweet);  
    } catch(e) {
      console.log(e);
    }
    // Parse Tweet
    try {
      var vote = yield _this.parseTweet(tweet);  
    } catch(e) {
      console.log(e);
    }
    // Check if tweet contained bill identifier and a vote
    if(vote.billIdentifier !== null && (vote.yes > 0 || vote.no > 0)) {
      // Parse Tweet
      try {
        var results = yield VotesRepository.upsertVote(vote);  
      } catch(e) {
        console.log(e);
      }
    }

  }).catch(function(err) {
    console.log(err);
  });
};

/**
 * Handle error events 
 * @param {Object} Error Object
 */
TwitterStreamingService.prototype.handleError = function(err) {
  console.log(err);
};

/**
 * Handle error events 
 * @param {Object} Error Object
 */
TwitterStreamingService.prototype.handleDelete = function(tweet) {
  console.log(tweet);
};

/**
 * Parse tweet
 * @param {Object} Tweet Object
 * @returns {Promise}
 */
TwitterStreamingService.prototype.parseTweet = function(tweet) {
  var details = {
    billIdentifier: null,
    yes: 0,
    no: 0,
    created_date: new Date()
  };
  return new Promise(function(resolve, reject) {
    co(function *() {
      // Open a db connection
      try {
        var conn = yield RethinkDbService.getConnection();
      } catch(e) {
        reject(e);
      }
      // Pluck fields
      try {
        var fields = yield r.expr(tweet)('entities')('hashtags')('text').run(conn);
      } catch(e) {
        reject(e);
      }
      // Extract bill identifier and determine vote
      for(var i = 0; i < fields.length; i++) {
        if(fields[i].indexOf('SB') !== -1) {
          details.billIdentifier = fields[i].replace('SB',  'SB ');
        }
        if(fields[i].indexOf('HB') !== -1) {
          details.billIdentifier = fields[i].replace('HB',  'HB ');
        }
        if(fields[i] === 'yes' || fields[i] === 'no') {
          details[fields[i]] = 1;
        }
      }
      resolve(details);
    }).catch(function(err) {
      console.log(err);
    });
  });
};

module.exports = new TwitterStreamingService();