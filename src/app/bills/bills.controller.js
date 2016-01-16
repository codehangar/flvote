(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillsCtrl', BillsCtrl);

  function BillsCtrl() {

    var vm = this;

    vm.fetchBills = function () {
      vm.bills = [{
        id: '1',
        name: 'Bill Name 1'
      }, {
        id: '2',
        name: 'Bill Name 2'
      }, {
        id: '3',
        name: 'Bill Name 3'
      }];
    };

    vm.init = function () {
      console.log('BillsCtrl init');
      vm.fetchBills();
    };

    vm.init();

  }

})();
