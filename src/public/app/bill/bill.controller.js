(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillCtrl', BillCtrl);

  function BillCtrl(TwitterSvc, TwitterVotesSvc, BillsSvc, $stateParams, $window, $http) {

    var vm = this;

    vm.fetchBill = function () {
      var billId = decodeURIComponent($stateParams.id);

      BillsSvc.fetchBillByID(billId).then(function(d) {
        vm.bill = d.data.data;
        console.log('vm.bill',vm.bill)
        getTwitterVotesForBills(vm.bill);
        TwitterSvc.addTwitterLinksToBill(vm.bill);
        vm.disqusConfig.disqus_title = vm.bill.attributes.identifier +': '+vm.bill.attributes.title;
      })
    };

    function getTwitterVotesForBills(bill){
      TwitterVotesSvc.fetchVotesForBill(bill).then(function(d) {
        var twitterVote = d.data[0];
        if(bill.attributes.identifier === twitterVote.billIdentifier)
          bill.twitterVotes = twitterVote;
      })
    }

    vm.init = function () {
      vm.fetchBill();
      vm.hashtagBill = "HB409";
      vm.hashtagYes = "yes";
      vm.billLink = encodeURIComponent("http://www.google.com");
      vm.canonicalUrl = $window.location.href;

      vm.disqusConfig = {
          disqus_shortname: 'flvote',
          disqus_identifier: $window.location.href,
          disqus_url: $window.location.href
      };

    };

    vm.init();

  }

})();
