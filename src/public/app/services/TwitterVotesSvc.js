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
        params: {
          // apikey: '932407d3-d4bd-4beb-8cd2-f4356036b6fc',
          // legislative_session: 2016,
        }
      };

      // this.fetchBillsThisSession = function (params) {
      //   var config = {
      //     params: params
      //   };
      //   var requestConfig = angular.merge({}, config, BASE_CONFIG);
      //   console.log("requestConfig", requestConfig)
      //   return $http(requestConfig);
      // };

      // this.fetchBillsCustomParams = function (params) {
      //   var requestConfig = angular.merge({}, {params: params}, BASE_CONFIG);
      //   return $http(requestConfig)
      // };
      this.fetchVotesForBill = function(bill) {
        console.log('bill',bill);
        BASE_CONFIG.params.url = BASE_CONFIG.params.url + '/' + bill.attributes.identifier
        return $http(BASE_CONFIG);
      };

      this.fetchVotesForBills = function(bills) {
        var billIds = [];
        console.log('bill',bills);
        angular.forEach(bills, function(bill){

          billIds.push(bill.attributes.identifier);
        });
        billIds = billIds.join(',')
        BASE_CONFIG.params.billIdentifiers = billIds
        return $http(BASE_CONFIG);
      };

      // this.fetchVoteByID = function(bills) {
      //   // voteId = voteId.replace('_','/');
      //   BASE_CONFIG.params.url = 'https://www.tabsontallahassee.com/api/'+voteId;
      //   // var requestConfig = angular.merge({}, BASE_CONFIG, {bill: voteId});
      //   // console.log("requestConfig", BASE_CONFIG)
      //   return $http(BASE_CONFIG);
      // };

      // this.fetchNext = function(url) {
      //   var requestConfig = angular.merge({}, BASE_CONFIG, {url: url});
      //   return $http(requestConfig);
      // }
    });
})();