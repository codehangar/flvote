(function () {
  'use strict';

  angular
    .module('flvote')
    .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    // $urlRouterProvider.otherwise('/errors/404/');

    $stateProvider
      .state('about', {
        url: '/about',
        views: {
          'header': {
            templateUrl: 'app/partials/header.html'
          },
          'footer': {
            templateUrl: 'app/partials/footer.html'
          },
          'content': {
            templateUrl: 'app/pages/about.html',
            // controller: 'BillsCtrl',
            // controllerAs: 'BillsCtrl'
          }
        }
      })
      .state('contact', {
        url: '/contact',
        views: {
          'header': {
            templateUrl: 'app/partials/header.html'
          },
          'footer': {
            templateUrl: 'app/partials/footer.html'
          },
          'content': {
            templateUrl: 'app/pages/contact.html',
            // controller: 'BillsCtrl',
            // controllerAs: 'BillsCtrl'
          }
        }
      })
      .state('bills', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'app/partials/header.html'
          },
          'footer': {
            templateUrl: 'app/partials/footer.html'
          },
          'content': {
            templateUrl: 'app/bills/bills.html',
            controller: 'BillsCtrl',
            controllerAs: 'BillsCtrl'
          }
        }
      })
      .state('bills.bySubject', {
        url: 'subject/:subject',
        views: {
          'content@': {
            templateUrl: 'app/bills/bills.html',
            controller: 'BillsCtrl',
            controllerAs: 'BillsCtrl'
          }
        }
      })
      .state('bills.detail', {
        url: ':id',
        views: {
          'content@': {
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

    $locationProvider.html5Mode(true).hashPrefix('!');;

  }

})();
