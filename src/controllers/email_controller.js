var contact = function() {
  return {
    email: '',
    name: '',
  };
};

function EmailController(google, emailService, $scope) {
  //  $scope.email = this;
  this.google = google;
  this.emailService = emailService;
  this.mesage = '';
  this.contacts = [];
  this.googleContacts = {};
  this.inputContact = contact();
}

EmailController.prototype.addInput = function() {
  this.contacts.push(this.inputContact);
  this.inputContact = contact();
};

/**
 * Fetches contacts from the google api.
 */
EmailController.prototype.fetchGmailEmails = function() {
  var that = this;
  this.google.getContacts(function(err, contacts) {
    if (err) {
      // Set user error feedback?
      return;
    }
    // Map the contacts in a hash
    contacts.forEach(function(value) {
      // Add an add function to allow
      // each object to be pushed into the array.
      that.googleContacts[value.email] = {
        name: value.name,
        push: function() {
          that.pushValue.call(that, value);
        },
      };
    });
  });
};

EmailController.prototype.pushValue = function(value) {
  this.contacts.push({
    email: value.email,
    name: value.name,
  });
};

/*
 * Server Interaction to send messages to users.
 */
EmailController.prototype.sendMessages = function() {
  var params = {
    contacts: this.contacts,
  };
  if (this.message) {
    params.message = this.message;
  }
  this.emailService.sendMessageToMany(params, function(err) {
    if (err) {
      // Set error message for user?
    }
  });
};

module.exports = EmailController;
