var PAV = window.PAV || {};
var commentReplyNotificationDirective = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      notification: '<',
    },
    templateUrl: 'partials/comment_reply_notification.html',
    link: function(scope) {
      scope.location = $location;

    },
  };
};

PAV.commentReplyNotificationDirective = commentReplyNotificationDirective;
module.exports = commentReplyNotificationDirective;
