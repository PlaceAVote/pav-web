var contact = function() {
  return {
    email: '',
    name: '',
  };
};

function EmailController(google) {
  this.mesage = '';
  this.contacts = [];
  this.google = google;
  this.googleContacts = {};
  this.inputContact = contact();
}

EmailController.prototype.addInput = function() {
  this.contacts.push(this.inputContact);
  this.inputContact = contact();
};

EmailController.prototype.fetchGmailEmails = function() {
  var that = this;
  this.google.getContacts(function(err, contacts) {
    if (err) {
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

module.exports = EmailController;

