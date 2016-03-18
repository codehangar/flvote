(function () {
  'use strict';

  angular
    .module('flvote')
    .controller('BillCtrl', BillCtrl);

  function BillCtrl(TwitterSvc, BillsSvc, $stateParams, $window, $http) {

    var vm = this;

    vm.fetchBill = function () {
      var billId = decodeURIComponent($stateParams.id);

      BillsSvc.fetchBillByID(billId).then(function(d) {
        vm.bill = d.data.data;
        console.log('vm.bill',vm.bill)
        TwitterSvc.addTwitterLinksToBill(vm.bill);
        vm.disqusConfig.disqus_title = vm.bill.attributes.title;
      })
    };

    vm.init = function () {
      vm.fetchBill();
      vm.hashtagBill = "HB409";
      vm.hashtagYes = "yes";
      vm.billLink = encodeURIComponent("http://www.google.com");
      vm.canonicalUrl = $window.location.href;

      vm.disqusConfig = {
          disqus_shortname: 'FLVOTE',
          disqus_identifier: $window.location.href +'/'+ $stateParams.id,
          disqus_url: $window.location.href +'/'+ $stateParams.id
      };

    };

    vm.init();

  }

})();
