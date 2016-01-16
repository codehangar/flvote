(function() {
  "use strict";
  angular
    .module('flvote')
    .service('TwitterSvc', function($http) {
      var BASE_CONFIG = {
        headers: {
          "Content-Type": 'application/json'
        },
        url: "http://www.flvote.org/api"
      };

      this.getTweetsTaggedFLVOTE = function() {
        var params = {
          q: '#flvote'
        };
        var requestConfig = angular.merge({}, {params: params}, BASE_CONFIG);
        return $http(requestConfig);
      }
    })
})();