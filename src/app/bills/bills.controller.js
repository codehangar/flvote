(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc) {

    var vm = this;

    vm.fetchBills = function () {
      BillsSvc.fetchBillsThisSession().then(function(d) {
        vm.bills = d.data.data;
        vm.meta = d.data.meta;
        vm.links = d.data.links;
      });
    };

    vm.init = function () {
      console.log('BillsCtrl init');
      vm.fetchBills();
    };

    vm.init();

  }

})();
