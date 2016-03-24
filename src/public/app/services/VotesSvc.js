(function() {
  "use strict";
  angular
    .module('flvote')
    .service('VotesSvc', function($http) {
      var BASE_CONFIG = {
        headers: {
          "Content-Type": 'application/vnd.api+json'
        },
        method: "GET",
        url: "https://www.tabsontallahassee.com/api/votes/",
        params: {
          apikey: '932407d3-d4bd-4beb-8cd2-f4356036b6fc',
          legislative_session: 2016,
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

      this.fetchVoteByBillID = function(billId) {
        billId = billId.replace('_','/');
        BASE_CONFIG.params.bill = billId
        // var requestConfig = angular.merge({}, BASE_CONFIG, {bill: billId});
        // console.log("requestConfig", BASE_CONFIG)
        return $http(BASE_CONFIG);
      };

      this.fetchVoteByID = function(voteId) {
        // voteId = voteId.replace('_','/');
        BASE_CONFIG.params.url = 'https://www.tabsontallahassee.com/api/'+voteId;
        // var requestConfig = angular.merge({}, BASE_CONFIG, {bill: voteId});
        // console.log("requestConfig", BASE_CONFIG)
        return $http(BASE_CONFIG);
      };

      // this.fetchNext = function(url) {
      //   var requestConfig = angular.merge({}, BASE_CONFIG, {url: url});
      //   return $http(requestConfig);
      // }
    });
})();