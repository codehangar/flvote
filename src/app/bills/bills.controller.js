(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl(BillsSvc) {

    var vm = this;

    BillsSvc.fetchBillsThisSession().then(function(d) {
      console.log(d);
    })

    vm.fetchBills = function () {
      BillsSvc.fetchBillsThisSession().then(function(d) {
        vm.bills = d.data.data;
      })
    };

    vm.init = function () {
      console.log('BillsCtrl init');
      vm.fetchBills();
    };

    vm.init();

  }

})();
