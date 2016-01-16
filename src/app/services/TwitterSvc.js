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
      };

      this.getVotesForSpecificBill = function(billIdentifier, cb) {
        var yesParams = {
          q: '#flvote+AND+#'+billIdentifier+'+AND+#yes'
        };
        var noParams = {
          q: '#flvote+AND+#'+billIdentifier+'+AND+#no'
        };
        var yesRequest = angular.merge({}, {params: yesParams}, BASE_CONFIG);
        var noRequest = angular.merge({}, {params: noParams}, BASE_CONFIG);
        $http(yesRequest)
          .then(function(yes) {
            $http(noRequest)
              .then(function(no) {
                return cb({yes: yes, no: no});
              })
          })
      }
    })
})();