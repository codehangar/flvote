(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc, TwitterSvc, $timeout, $location, $stateParams) {

    var vm = this;

    vm.fetchBills = function (query) {
      var params = {
        q: query,
        subject: vm.subject
      };
      BillsSvc.fetchBillsCustomParams(params).then(function(d) {
        vm.allBills = d.data.data;
        vm.bills = vm.allBills.slice(0,10);
        vm.meta = d.data.meta;
        vm.links = d.data.links;
        generateTwitterShareLink(vm.bills)
      })
      // GA tracking
      ga('send', {
        'hitType': 'event',
        'eventCategory': 'User Find Bills',
        'eventAction': 'Submit Search Query',
        'eventLabel': query
        });
    };

    function generateTwitterShareLink(bills){
      angular.forEach(bills, function(bill){
        TwitterSvc.addTwitterLinksToBill(bill);
      });
    }

    vm.voteNo = function(bill){
      // GA tracking
      ga('send', {
        'hitType': 'event',
        'eventCategory': 'Twitter Button',
        'eventAction': 'Click Vote #NO',
        'eventLabel': bill.attributes.identifier + ' ' + bill.attributes.title
        });
    }

    vm.voteYes = function(bill){
      // GA tracking
      ga('send', {
        'hitType': 'event',
        'eventCategory': 'Twitter Button',
        'eventAction': 'Click Vote #YES',
        'eventLabel': bill.attributes.identifier + ' ' + bill.attributes.title
        });
    }

    vm.getNextPage = function() {
      var idx = _.findIndex(vm.allBills, function(bill) {
        return bill.id === vm.bills[vm.bills.length - 1].id
      });
      console.log('idx',idx)
      if (idx !== vm.allBills.length - 1) {
        vm.bills = vm.allBills.slice(0, idx + 10);
        generateTwitterShareLink(vm.bills.slice(idx, idx + 10))
      } else {
        BillsSvc.fetchNext(vm.links.next)
          .then(function(d) {
            vm.allBills = [].concat(vm.allBills, d.data.data);
            vm.bills = vm.allBills.slice(0, idx + 10);
            generateTwitterShareLink(vm.bills.slice(idx, idx + 10))
          })
      }
      ga('send', {
        'hitType': 'event',
        'eventCategory': 'User Find Bills',
        'eventAction': 'Click Load More',
        'eventLabel': 'Show ' + vm.bills.length + '  results'
        });
    };

    vm.init = function () {
      vm.subject = $stateParams.subject;

      vm.fetchBills();

      // vm.searchQuery = $location.search().
    };

    vm.init();

  }

})();
