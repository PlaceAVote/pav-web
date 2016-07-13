var emailConnectionsDirective = function($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/email_connections.html',
    link: function(scope, el, attr) {
      scope.showModal = function(context) {
        scope.context = context;
        scope.body = angular.element(document.body);
        $compile('<email-connections-modal id="email-connections-modal" context="context"></email-connections-modal>')(scope, function(cloned, scope) {
          scope.body.append(cloned);
          scope.body.addClass('c-modal__body--active');
        });
      };

      scope.closeModal = function() {
        scope.body.removeClass('c-modal__body--active');
        angular.element(document.querySelector('email-connections-modal')).remove();
      };
    },
  };
};
module.exports = emailConnectionsDirective;
