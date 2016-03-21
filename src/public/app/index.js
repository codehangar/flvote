(function () {
  'use strict';

  angular
    .module('flvote', [
      'ui.router',
      'ngMessages',
      'angularUtils.directives.dirDisqus'
    ]);

  angular
    .module('flvote')
    .run(function ($http) {
      $http.defaults.headers.common['Content-Type'] = 'application/json';
    });
})();
