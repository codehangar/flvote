(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc, TwitterSvc, VotesSvc, $timeout, $location, $stateParams, $window) {

    var vm = this;

    vm.fetchBills = function (query, sort) {
      var params = {
        q: query,
        subject: vm.subject,
        sort: sort
      };
      BillsSvc.fetchBillsCustomParams(params).then(function(d) {
        vm.allBills = d.data.data;
        vm.bills = vm.allBills.slice(0,10);
        vm.meta = d.data.meta;
        vm.links = d.data.links;
        generateTwitterShareLink(vm.bills)
        getExtraBillInfo(vm.bills);
        // getBillVoteInfo(vm.bills);
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

      var idx = vm.bills.length - 1;

      if (vm.bills.length < vm.allBills.length) {
        vm.bills = vm.allBills.slice(0, idx + 10);
        generateTwitterShareLink(vm.bills.slice(idx, idx + 10))
        sendGAEvent();
        getExtraBillInfo();
      } else if (vm.links.next) {
        BillsSvc.fetchNext(vm.links.next)
          .then(function(d) {
            vm.allBills = [].concat(vm.allBills, d.data.data);
            vm.bills = vm.allBills.slice(0, idx + 10);
            generateTwitterShareLink(vm.bills.slice(idx, idx + 10));
            sendGAEvent();
            getExtraBillInfo();
            getBillVoteInfo();
          })
      }

      function sendGAEvent(){
        ga('send', {
          'hitType': 'event',
          'eventCategory': 'User Find Bills',
          'eventAction': 'Click Load More',
          'eventLabel': 'Show ' + vm.bills.length + '  results'
          });
      }
    };

    function getExtraBillInfo(bills){
      angular.forEach(vm.bills, function(bill){
        bill.disqusId = $window.location.href + bill.billId;
        // console.log('DISQUSWIDGETS',DISQUSWIDGETS);
        BillsSvc.fetchBillByID(bill.billId).then(function(d) {
          bill.extra = d.data.data;
          angular.forEach(bill.extra.attributes.actions, function(action){
            action.date = moment(action.date).format('l');
          })
        })
      })
    }

    // function getBillVoteInfo(){
    //   angular.forEach(vm.bills, function(bill){
    //     VotesSvc.fetchVoteByBillID(bill.billId).then(function(d) {
    //       bill.vote = d.data.data;
    //       console.log('vote', bill.vote[0])
    //       // VotesSvc.fetchVoteByID(bill.vote[0].id).then(function(d) {
    //       //   bill.votes = d.data.data;
    //       //   console.log('votes', bill.votes)
    //       // })
    //     })
        
    //   })
    // }

    vm.setSort = function(sort){
      console.log('set sort', sort);
      vm.fetchBills(undefined, sort)
    }

    vm.init = function () {
      vm.subject = $stateParams.subject;

      vm.fetchBills();

      // vm.searchQuery = $location.search().
    };

    vm.init();

  }

})();
