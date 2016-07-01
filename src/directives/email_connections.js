var emailConnectionsDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/email_connections.html',
  };
};
module.exports = emailConnectionsDirective;
