(function() {
  "use strict";
  angular
    .module('flvote')
    .service('TwitterSvc', function($http, $q) {
      var BASE_CONFIG = {
        headers: {
          "Content-Type": 'application/json'
        },
        url: "/api/twitter/1.1/search/tweets.json"
      };

      this.getTweetsTaggedFLVOTE = function() {
        var params = {
          q: '#flvote'
        };
        var requestConfig = angular.merge({}, {
          params: params
        }, BASE_CONFIG);
        return $http(requestConfig);
      };

      this.addTwitterLinksToBill = function(bill) {

        var voteYesStatus = 'I support ' + bill.hashIdentifier + ' Show your support, vote #yes at ' +
          bill.billLink + ' #flvote #tabsontally @CodeForOrlando @tabsontally';
        bill.voteYesLink = 'https://twitter.com/home?status=' + encodeURIComponent(voteYesStatus);

        var voteNoStatus = 'I don’t support ' + bill.hashIdentifier + ' Stop this bill by voting vote #no at ' +
          bill.billLink + ' #flvote #tabsontally @CodeForOrlando @tabsontally';
        bill.voteNoLink = 'https://twitter.com/home?status=' + encodeURIComponent(voteNoStatus);
      }
    })
})();
