(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc, $timeout) {

    var vm = this;

    vm.fetchBills = function () {
      BillsSvc.fetchBillsThisSession().then(function(d) {
        vm.bills = d.data.data;
        vm.meta = d.data.meta;
        vm.links = d.data.links;
        generateTwitterShareLink(vm.bills)
      })
    };

    function generateTwitterShareLink(bills){
      angular.forEach(bills, function(bill){
        var identifier = bill.attributes.identifier;
        identifier = identifier.replace(/\s/g, '');
        var billLink = "http://www.flvote.org/"+bill.id
        billLink = encodeURIComponent(billLink);
        // console.log(identifier, bill)
        bill.voteYesLink = 'https://twitter.com/home?status=I%20support%20%23'+identifier+
        '%20Show%20your%20support,%20vote%20%23'+'yes'+'%20at%20'+billLink+
        '%20%23flvote%20%23tabsontally%20%40CodeForOrlando%20%40tabsontally';
        bill.voteNoLink = 'https://twitter.com/home?status=I%20don%E2%80%99t%20support%20%23'+identifier+
        '%20Stop%20this%20bill%20by%20voting%20vote%20%23'+'no'+'%20at%20'+ billLink+
        '%20%23flvote%20%23tabsontally%20%40CodeForOrlando%20%40tabsontally%0A;'
        // console.log(bill.voteYesLink);
      })
    }

    vm.getNextPage = function() {
      BillsSvc.getNext(vm.links.next)
        .then(function(d) {
          $timeout(function() {
            vm.bills = [].concat(vm.bills, d.data.data);
          });
        })
    };

    vm.init = function () {
      console.log('BillsCtrl init');
      vm.fetchBills();
    };

    vm.init();

  }

})();
