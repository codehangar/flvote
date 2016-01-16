(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillCtrl', BillCtrl);

  function BillCtrl() {

    var vm = this;

    vm.fetchBill = function () {
    };

    vm.init = function () {
      console.log('BillCtrl init');
      vm.fetchBill();
    };

    vm.init();

  }

})();
