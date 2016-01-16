var OAuth = require('oauth').OAuth;

var TwitterService = function() {

};

/**
 * Setup twitter oauth
 *
 * @param {String} callback url if needed
 * @returns {Promise}
 */
TwitterService.prototype.initTwitterOauth = function(callback) {
  return new Promise(function(resolve, reject) {
    console.log('process.env.TWITTER_CONSUMER_KEY', process.env.TWITTER_CONSUMER_KEY);
    console.log('process.env.TWITTER_CONSUMER_SECRET', process.env.TWITTER_CONSUMER_SECRET);
    console.log('callback', callback);
    var oa = new OAuth(
      "https://twitter.com/oauth/request_token"
    , "https://twitter.com/oauth/access_token"
    , process.env.TWITTER_CONSUMER_KEY
    , process.env.TWITTER_CONSUMER_SECRET
    , "1.0A"
    , callback
    , "HMAC-SHA1"
    );
    console.log('++++++++++++oa', oa);
    resolve(oa);
  });
};

/**
 * Returns oauth token, and oauth secrect for Twitter Application
 *
 * @param {Object} OAuth object
 * @returns {Promise}
 */
TwitterService.prototype.getOAuthRequestToken = function(oa) {
  return new Promise(function(resolve, reject) {
    oa.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
        reject(error);
      } else { 
        // Return the oauth token for the application to use in the authorize call
        resolve({
          oauthToken: oauthToken,
          oauthTokenSecret: oauthTokenSecret
        });
      }
    });
  });
}

/**
 * Compose a tweet for a user
 *
 * @param {Object} OAuth object
 * @param {Object} Post object
 * @param {Object} Creds object
 * @returns {Promise}
 */
TwitterService.prototype.composeTweet = function(oa, post, creds) {
  return new Promise(function(resolve, reject) {
    oa.post(
      'https://api.twitter.com/1.1/statuses/update.json',
      creds.accessToken, //test user token
      creds.accessTokenSecret, //test user secret
      {
        status: post.message()
      },
      function (e, data, res){
        if(e) {
          reject(e);
        } else {
          resolve(data);
        }
    }); 
  });
}


module.exports = new TwitterService();
