(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc, $timeout) {

    var vm = this;

    function parseData(d) {

    }

    vm.fetchBills = function () {
      BillsSvc.fetchBillsThisSession().then(function(d) {
        vm.allBills = d.data.data;
        vm.bills = vm.allBills.slice(0,10);
        vm.meta = d.data.meta;
        vm.links = d.data.links;
        generateTwitterShareLink(vm.bills)
      })
    };

    function generateTwitterShareLink(bills){
      angular.forEach(bills, function(bill){
        var identifier = bill.attributes.identifier;
        identifier = identifier.replace(/\s/g, '');
        var billId = bill.id.replace(/\//g, "_");
        var billLink = "http://www.flvote.org/"+billId
        bill.billId = billId;
        // billLink = encodeURIComponent(billLink);
        console.log(identifier, billLink)
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
      var idx = _.findIndex(vm.allBills, function(bill) {
        return bill.id === vm.bills[vm.bills.length - 1].id
      });
      if (idx !== vm.allBills.length - 1) {
        vm.bills = vm.allBills.slice(0, idx + 10);
      } else {
        BillsSvc.fetchNext(vm.links.next)
          .then(function(d) {
            vm.allBills = [].concat(vm.allBills, d.data.data);
            vm.bills = vm.allBills.slice(0, idx + 10);
          })
      }

      //var options = {
      //  current: vm.bills,
      //  fetched: vm.allBills,
      //  nextLink: vm.links.next
      //};
      //BillsSvc.getNext(options)
      //  .then(function(d) {
      //    $timeout(function() {
      //      vm.bills = [].concat(vm.bills, d.data.data);
      //    });
      //  })
    };

    vm.init = function () {
      console.log('BillsCtrl init');
      vm.fetchBills();
    };

    vm.init();

  }

})();
