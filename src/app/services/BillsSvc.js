(function() {
    "use strict";
    angular.module('flvote')
        .service('BillsSvc', function($http) {

            var BASE_CONFIG = {
                headers: {
                    "X-APIKEY": '932407d3-d4bd-4beb-8cd2-f4356036b6fc'
                },
                method: "GET",
                url: 'http://www.tabsontallahassee.com/api/bills'
            };

            this.fetchBillsThisSession = function() {
                var params = {
                    params: {
                        legislative_session: CURRENT_SESSION
                    }
                };
                var requestConfig = angular.merge({}, params, BASE_CONFIG);
                return $http(requestConfig);
            };

            this.fetchBillsWithCustomParams = function(params) {
                var requestConfig = angular.merge({}, {params: params}, BASE_CONFIG);
                return $http(requestConfig);
            };
        });
});