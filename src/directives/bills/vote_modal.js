var PAV = window.PAV || {};
var vote = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/bills/bill_vote.html',
  };
};
PAV.voteModalDirective = vote;
module.exports = vote;
