var PAV = window.PAV || {};
var emailConnectionsDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/email_connections.html',
  };
};
PAV.emailConnectionsDirective = emailConnectionsDirective;
module.exports = emailConnectionsDirective;
