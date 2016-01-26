function ContactController($scope, $window) {
  $scope = $scope || {};
  this.scope = $scope;
  this.window = $window;
}

ContactController.prototype.toMail = function() {
	var mailBody = this.mailBody ? "?body=" + encodeURIComponent(this.mailBody) : "";
  var mail = "mailto:hello@placeavote.com" + mailBody;
  this.window.location.href = mail;
};

module.exports = ContactController;