(function () {
  'use strict';

  angular
    .module('flvote')
    .config(function ($stateProvider) {

      $stateProvider
        .state('error', {
          abstract: true,
          views: {
            'header': {
              templateUrl: 'app/partials/header.html'
            }
          }
        })
        .state('error.500', {
          url: '/errors/500/',
          views: {
            'content@': {
              templateUrl: 'app/errors/500.html'
            }
          }
        })
        .state('error.404', {
          url: '/errors/404/',
          views: {
            'content@': {
              templateUrl: 'app/errors/404.html'
            }
          }
        })

    });

}());
