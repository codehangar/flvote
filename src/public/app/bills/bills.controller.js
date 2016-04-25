(function() {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc, TwitterSvc, TwitterVotesSvc, VotesSvc, $timeout, $location, $stateParams, $window, DisqusSvc, $rootScope) {

    var vm = this;

    vm.fetchBills = function(query, sort) {
      var params = {
        q: query,
        subject: vm.subject,
        sort: sort
      };
      BillsSvc.fetchBillsCustomParams(params).then(function(d) {
        vm.allBills = d.data.data;
        vm.bills = vm.allBills.slice(0, 10);
        vm.meta = d.data.meta;
        vm.links = d.data.links;
        addAllMetaToBills(vm.bills);

        $timeout(function() {
          console.log("reset comment counts")
          DISQUSWIDGETS.getCount({
            reset: true
          });
        }, 600);
      })

      // GA tracking
      ga('send', {
        'hitType': 'event',
        'eventCategory': 'User Find Bills',
        'eventAction': 'Submit Search Query',
        'eventLabel': query
      });
    };

    vm.voteNo = function(bill) {
      // GA tracking
      ga('send', {
        'hitType': 'event',
        'eventCategory': 'Twitter Button',
        'eventAction': 'Click Vote #NO',
        'eventLabel': bill.attributes.identifier + ' ' + bill.attributes.title
      });
    }

    vm.voteYes = function(bill) {
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
        addAllMetaToBills(vm.bills.slice(idx, idx + 10))
        sendGAEvent();
      } else if (vm.links.next) {
        BillsSvc.fetchNext(vm.links.next)
          .then(function(d) {
            vm.allBills = [].concat(vm.allBills, d.data.data);
            vm.bills = vm.allBills.slice(0, idx + 10);
            addAllMetaToBills(vm.bills.slice(idx, idx + 10));
            sendGAEvent();
          })
      }

      function sendGAEvent() {
        ga('send', {
          'hitType': 'event',
          'eventCategory': 'User Find Bills',
          'eventAction': 'Click Load More',
          'eventLabel': 'Show ' + vm.bills.length + '  results'
        });
      }
    };

    function getTwitterVotesForBills(bills) {
      TwitterVotesSvc.fetchVotesForBills(bills).then(function(d) {
        var twitterVotes = d.data;
        angular.forEach(bills, function(bill) {
          angular.forEach(twitterVotes, function(v) {
            if (bill.attributes.identifier === v.billIdentifier)
              bill.twitterVotes = v;
          })
        })
      })
    }

    function addAllMetaToBills(bills) {

      angular.forEach(bills, function(bill) {

        // Converts ID's to usable formats
        bill = BillsSvc.addCustomBillFields(bill);

        // Generates Disqus config settings
        bill.disqusConfig = DisqusSvc.getDisqusConfigForBill(bill);

        // Pulls down full Bill details
        BillsSvc.fetchBillByID(bill.billId).then(function(d) {
          bill.extra = d.data.data;
          angular.forEach(bill.extra.attributes.actions, function(action) {
            action.date = moment(action.date).format('l');
          })
        });

        // Generates Twitter Voting Links
        TwitterSvc.addTwitterLinksToBill(bill);
      });

      getTwitterVotesForBills(bills);
    }

    function fetchAllTwitterVotes() {
      TwitterVotesSvc.fetchAllVotes().then(function(d) {
        vm.twitterVotes = d.data;
        vm.totalVotes = 0;
        angular.forEach(vm.twitterVotes, function(vote) {
          vm.totalVotes = vm.totalVotes + vote.no;
          vm.totalVotes = vm.totalVotes + vote.yes;
          $rootScope.totalVotes = vm.totalVotes;
        })
      });
    }

    vm.setSort = function(sort) {
      vm.fetchBills(undefined, sort)
    }

    vm.init = function() {
      vm.subject = $stateParams.subject;
      vm.fetchBills();
      fetchAllTwitterVotes();
      // vm.searchQuery = $location.search().
    };

    vm.init();

  }

})();
