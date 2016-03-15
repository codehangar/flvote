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
        TwitterSvc.addTwitterLinksToBill(vm.bill);
      })

      

    };

    vm.initDisqus = function(){
      var disqus_config = function () {
          this.page.url = vm.canonicalUrl;  // Replace PAGE_URL with your page's canonical URL variable
          this.page.identifier = $stateParams.id; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
      };
      
      (function() {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW
          var d = document, s = d.createElement('script');
          
          s.src = '//FLVOTE.disqus.com/embed.js';  // IMPORTANT: Replace EXAMPLE with your forum shortname!
          
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
      })();
    }

    vm.init = function () {
      vm.fetchBill();
      vm.hashtagBill = "HB409";
      vm.hashtagYes = "yes";
      vm.billLink = encodeURIComponent("http://www.google.com");
      vm.canonicalUrl = $window.location.href;
      
      vm.disqusConfig = {
          disqus_shortname: 'FLVOTE',
          disqus_identifier: $stateParams.id,
          disqus_url: $window.location.href
      };

    };

    vm.init();

  }

})();
