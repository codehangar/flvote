(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillCtrl', BillCtrl);

  function BillCtrl() {

    var vm = this;

    vm.fetchBill = function () {
      console.log('fetchBill')
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
