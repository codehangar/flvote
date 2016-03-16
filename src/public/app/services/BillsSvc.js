(function() {
  "use strict";
  angular
    .module('flvote')
    .service('BillsSvc', function($http) {
      var BASE_CONFIG = {
        headers: {
          "Content-Type": 'application/vnd.api+json'
        },
        method: "GET",
        url: "https://www.tabsontallahassee.com/api/bills/?sort=-updated_at",
        params: {
          apikey: '932407d3-d4bd-4beb-8cd2-f4356036b6fc',
          legislative_session: 2016,
        }
      };

      this.fetchBillsThisSession = function (query) {
        var params = {
          params: {
            q: query
          }
        };
        var requestConfig = angular.merge({}, params, BASE_CONFIG);
        console.log("requestConfig", requestConfig)
        return $http(requestConfig);
      };

      this.fetchBillsCustomParams = function (params) {
        var requestConfig = angular.merge({}, {params: params}, BASE_CONFIG);
        return $http(requestConfig)
      };

      this.fetchBillByID = function(id) {
        id = id.replace('_','/');
        var requestConfig = angular.merge({}, BASE_CONFIG, {url: 'https://www.tabsontallahassee.com/api/' + id});
        return $http(requestConfig);
      };

      this.fetchNext = function(url) {
        var requestConfig = angular.merge({}, BASE_CONFIG, {url: url});
        return $http(requestConfig);
      }
    });
})();