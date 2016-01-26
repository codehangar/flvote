(function () {
  'use strict';

  angular
    .module('flvote', [
      'ui.router',
      'ngMessages'
    ]);

  angular
    .module('flvote')
    .run(function ($http) {
      $http.defaults.headers.common['Content-Type'] = 'application/json';
    });
})();
