var PAV = window.PAV || {};
var emailValidator = require('../utils/email_validation.js');
var contact = function() {
  return {
    email: '',
    name: '',
  };
};

function EmailController(google, emailService, $scope) {
  this.show = true;
  this.importContacts = true;
  this.google = google;
  this.emailService = emailService;
  this.mesage = '';
  this.contacts = [];
  this.fetching = null;
  this.googleLoadedContacts = null;
  this.googleContacts = {};
  this.inputContact = contact();
  this.googleContactsError = null;
}

EmailController.prototype.addInput = function() {
  if (!emailValidator(this.inputContact.email)) {
    this.inputContact.invalid = true;
    return;
  }
  this.pushValue(this.inputContact);
  this.inputContact = contact();
};

EmailController.prototype.togglePage = function() {
  this.errNoContacts = false;
  this.errUnkown = false;
  this.errUnauth = false;
  this.importContacts = this.importContacts ? false : true;
};

EmailController.prototype.close = function() {
  this.show = false;
};

/**
 * Fetches contacts from the google api.
 */
EmailController.prototype.fetchGmailEmails = function() {
  var that = this;
  this.fetching = true;
  this.googleContactsError = false;
  this.google.getContacts(function(err, contacts) {
    if (err) {
      that.fetching = false;
      that.googleContactsError = true;
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
          this.added = true;
          that.pushValue.call(that, value);
        },
      };
    });
    that.googleContactsLoaded = true;
    that.fetching = false;
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
  var that = this;
  this.emailService.sendMessageToMany(params, function(err) {
    if (err) {
      switch (err.message) {
        case 'Invalid Params: Contacts Needed.': {
          that.errNoContacts = true;
          break;
        }
        case 'Invalid Params: Auth Token Needed.': {
          that.errUnauth = true;
          break;
        }
        default: {
          that.errUnknown = true;
          break;
        }
      }
      return;
    }
    // Clear state
    //   - need a good way to hide this too?
    //   - and be accessible from anywhere in the app.
    that.mesage = '';
    that.contacts = [];
    that.fetching = null;
    that.googleLoadedContacts = null;
    that.googleContacts = {};
    that.inputContact = contact();
    that.importContacts = true;
    that.show = false;
  });
};

module.exports = EmailController;
PAV.emailController = EmailController;
