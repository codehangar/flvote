(function() {
  "use strict";
  angular
    .module('flvote')
    .service('TwitterSvc', function($http, $q) {
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
      };

      this.getVotesForSpecificBill = function(billIdentifier) {
        var yesParams = {
          q: '#flvote #'+billIdentifier+' #yes'
        };
        var noParams = {
          q: '#flvote #'+billIdentifier+' #no'
        };

        var yesRequest = angular.merge({}, {params: yesParams}, BASE_CONFIG);
        var noRequest = angular.merge({}, {params: noParams}, BASE_CONFIG);

        var yesProm = $q(function(resolve, reject) {
          $http(yesRequest).then(resolve);
        });
        var noProm = $q(function(resolve, reject) {
          $http(noRequest).then(resolve);
        });

        return $q.all([yesProm, noProm]);
      }
    })
})();