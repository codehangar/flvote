(function () {
  'use strict';

  angular
    .module('flvote')
    .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/errors/404/');

    $stateProvider
      .state('bills', {
        url: '/bills',
        views: {
          'header': {
            templateUrl: 'app/partials/header.html'
          },
          'content': {
            templateUrl: 'app/bills/bills.html',
            controller: 'BillsCtrl',
            controllerAs: 'BillsCtrl'
          }
        }
      })
      .state('bills.detail', {
        url: '/:id',
        views: {
          'header': {
            templateUrl: 'app/partials/header.html'
          },
          'content': {
            templateUrl: 'app/bill/bill.html',
            controller: 'BillCtrl',
            controllerAs: 'BillCtrl'
          }
        }
      });

    //$urlRouterProvider.rule(function ($injector, $location) {
    //  var path = $location.url();
    //  // check to see if the path already has a slash where it should be
    //  if ('/' === path[path.length - 1] || path.indexOf('/?') > -1) {
    //    return;
    //  }
    //  if (path.indexOf('?') > -1) {
    //    return path.replace('?', '/?');
    //  }
    //  return path + '/';
    //});

    //$locationProvider.html5Mode(true);

  }

})();
