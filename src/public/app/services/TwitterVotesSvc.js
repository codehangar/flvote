(function() {
  "use strict";
  angular
    .module('flvote')
    .service('TwitterVotesSvc', function($http) {
      var BASE_CONFIG = {
        headers: {
          "Content-Type": 'application/vnd.api+json'
        },
        method: "GET",
        url: "/api/v1/votes",
        params: {}
      };

      this.fetchVotesForBill = function(bill) {
        console.log('bill',bill);
        BASE_CONFIG.params.url = BASE_CONFIG.params.url + '/' + bill.attributes.identifier
        return $http(BASE_CONFIG);
      };

      this.fetchVotesForBills = function(bills) {
        var billIds = [];
        angular.forEach(bills, function(bill){
          billIds.push(bill.attributes.identifier);
        });
        billIds = billIds.join(',')
        BASE_CONFIG.params.billIdentifiers = billIds
        return $http(BASE_CONFIG);
      };

    });
})();