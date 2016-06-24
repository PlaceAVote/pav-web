var config = require('../../config/endpoints.js');
var PAV = window.PAV || {};
function ContactController($scope, $timeout, mailService) {
  $scope = $scope || {};
  this.scope = $scope;
  this.timeout = $timeout;
  this.mailService = mailService;
}

ContactController.prototype.toMail = function() {
  var mailData = {
    name: this.name,
    email: this.email,
    body: this.mailBody,
  };

  var that = this;
  this.mailService.sendMail(mailData, function(err, result) {
    if (err) {
      that.sendMailErr = true;
      that.sendMailSuccess = false;
    } else {
      that.sendMailErr = false;
      that.sendMailSuccess = true;
      that.name = '';
      that.email = '';
      that.mailBody = '';
    }
    that.timeout(function() {
      that.sendMailSuccess = false;
      that.sendMailErr = false;
    }, 5000);
  });
};

PAV.contactController = ContactController;
module.exports = ContactController;
