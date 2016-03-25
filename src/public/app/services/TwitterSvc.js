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
        var requestConfig = angular.merge({}, {params: params}, BASE_CONFIG);
        return $http(requestConfig);
      };

      this.addTwitterLinksToBill = function(bill) {

        var identifier = bill.attributes.identifier;
        var hashIdentifier = identifier.replace(/\s/g, '');
        var billId = bill.id.replace(/\//g, "_");
        var billLink = "http://www.flvote.org/"+billId
        bill.billId = billId;
        billLink = encodeURIComponent(billLink);

        bill.voteYesLink = 'https://twitter.com/home?status=I%20support%20%23'+hashIdentifier+
        '%20Show%20your%20support,%20vote%20%23'+'yes'+'%20at%20'+billLink+
        '%20%23flvote%20%23tabsontally%20%40CodeForOrlando%20%40tabsontally';
        bill.voteNoLink = 'https://twitter.com/home?status=I%20don%E2%80%99t%20support%20%23'+hashIdentifier+
        '%20Stop%20this%20bill%20by%20voting%20vote%20%23'+'no'+'%20at%20'+ billLink+
        '%20%23flvote%20%23tabsontally%20%40CodeForOrlando%20%40tabsontally%0A';
      }
    })
})();