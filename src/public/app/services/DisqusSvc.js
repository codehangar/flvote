(function() {
  "use strict";
  angular
    .module('flvote')
    .service('DisqusSvc', function($http) {

      this.getDisqusConfigForBill = function(bill) {
        return {
          disqus_shortname: 'flvote',
          disqus_identifier: bill.billId,
          disqus_url: 'http://www.flvote.org/bills/' + bill.billId,
          disqus_title: bill.attributes.identifier + ': ' + bill.attributes.title
        }
      };
    });
})();
