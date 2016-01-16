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
        url: "https://www.tabsontallahassee.com/api/bills",
        params: {
          apikey: '932407d3-d4bd-4beb-8cd2-f4356036b6fc'
        }
      };

      this.fetchBillsThisSession = function () {
        var params = {
          params: {
            legislative_session: 2015
          }
        };
        var requestConfig = angular.merge({}, params, BASE_CONFIG);
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