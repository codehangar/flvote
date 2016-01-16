(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillCtrl', BillCtrl);

  function BillCtrl(BillsSvc, $stateParams) {

    var vm = this;

    vm.fetchBill = function () {
      var billId = decodeURIComponent($stateParams.id);
      
      console.log('fetchBillsss', billId)
      
      BillsSvc.fetchBillByID(billId).then(function(d) {
        vm.bill = d.data.data;
        console.log(vm.bill)
        var identifier = vm.bill.attributes.identifier;
        var billId = vm.bill.id.replace(/\//g, "_");
        var billLink = "http://www.flvote.org/"+billId
        // vm.meta = d.data.meta;
        // vm.links = d.data.links;
        // generateTwitterShareLink(vm.bills)
        vm.bill.voteYesLink = 'https://twitter.com/home?status=I%20support%20%23'+identifier+
        '%20Show%20your%20support,%20vote%20%23'+'yes'+'%20at%20'+billLink+
        '%20%23flvote%20%23tabsontally%20%40CodeForOrlando%20%40tabsontally';
      vm.bill.voteNoLink = 'https://twitter.com/home?status=I%20don%E2%80%99t%20support%20%23'+identifier+
        '%20Stop%20this%20bill%20by%20voting%20vote%20%23'+'no'+'%20at%20'+ billLink+
        '%20%23flvote%20%23tabsontally%20%40CodeForOrlando%20%40tabsontally%0A;'
      })
      
    };

    vm.init = function () {
      vm.fetchBill();
      vm.hashtagBill = "HB409";
      vm.hashtagYes = "yes";
      vm.billLink = encodeURIComponent("http://www.google.com");
      console.log('BillCtrl init', vm.billLink);
    };

    vm.init();

  }

})();
