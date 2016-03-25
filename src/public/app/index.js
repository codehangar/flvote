(function () {
  'use strict';

  angular
    .module('flvote', [
      'ui.router',
      'ngMessages',
      'angularUtils.directives.dirDisqus',
      'ngDisqus'
    ]);

  angular
    .module('flvote')
    .run(function ($http) {
      $http.defaults.headers.common['Content-Type'] = 'application/json';
    });
})();
