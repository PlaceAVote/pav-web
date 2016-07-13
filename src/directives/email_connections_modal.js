var emailValidator = require('../utils/email_validation.js');

module.exports = function(google, emailService, $timeout) {
  return {
    restrict: 'E',
    scope: {
      context: '=',
    },
    templateUrl: 'partials/email_connections_modal.html',
    link: function(scope, el, attr) {
      var contact = function() {
        return {
          email: '',
          name: '',
        };
      };

      scope.importContacts = true;
      scope.google = google;
      scope.emailService = emailService;
      scope.mesage = '';
      scope.contacts = [];
      scope.fetching = null;
      scope.googleLoadedContacts = null;
      scope.googleContacts = {};
      scope.inputContact = contact();
      scope.googleContactsError = null;
      scope.timeout = $timeout;
      scope.manualContacts = false;
      scope.inputContact = {
        name: '',
        email: '',
      };

      scope.views = {
        gmail: false,
        manual: false,
      };

      scope.view = function(view) {
        for (var v in scope.views) {
          if (view === v) {
            scope.views[view] = true;
          } else {
            scope.views[v] = false;
          }
        }
      };

      /**
       * Fetches contacts from the google api.
       */
      scope.fetchGmailEmails = function() {
        var that = this;
        scope.fetching = true;
        scope.googleContactsError = false;
        scope.google.getContacts(function(err, contacts) {
          if (err) {
            scope.fetching = false;
            scope.googleContactsError = true;
            scope.manualContacts = true;
            // Set user error feedback?
            return;
          }
          // Map the contacts in a hash
          contacts.forEach(function(value) {
            scope.googleContacts[value.email] = {
              name: value.name,
            };
          });

          scope.googleContactsLoaded = true;
          scope.fetching = false;
          scope.view('gmail');
          scope.$apply();
        });
      };

      scope.addGmailContact = function(value) {
        if (scope.googleContacts[value.email]) {
          if (!scope.googleContacts[value.email].added) {
            scope.googleContacts[value.email].added = true;
            scope.pushValue(value);
          } else {
            scope.googleContacts[value.email].added = false;
            scope.removeValue(value.email);
            return;
          }
        }
      };

      scope.addUserContact = function(value) {
        if (!emailValidator(value.email)) {
          scope.emailInvalid = true;
          return;
        }

        scope.emailInvalid = false;

        for (var contact in scope.contacts) {
          if (scope.contacts[contact].email === value.email) {
            scope.removeValue(value.email);
            return;
          }
        }
        scope.pushValue(value);
      };

      scope.pushValue = function(value) {
        scope.contacts.unshift({
          email: value.email,
          name: value.name,
          added: true,
        });
      };


      /*
       * Server Interaction to send messages to users.
       */

      scope.sendInvite = function(userContact, manual) {
        if (!userContact) {
          return;
        }

        if (!emailValidator(userContact.email)) {
          scope.emailInvalid = true;
          scope.timeout(function() {
            scope.emailInvalid = false;
          }, 2000);
          return;
        }

        // Checks to see if contact is a google contacts
        // If so, it checks if the user has already been invited
        if (scope.googleContacts[userContact.email]) {
          if (scope.googleContacts[userContact.email].invited) {
            scope.alreadyInvited = true;
            scope.timeout(function() {
              scope.alreadyInvited = false;
            }, 2000);
            return;
          }
        }

        if (scope.sendingInvite && scope.googleContacts[userContact.email].sendingInvite) {
          return;
        }

        if (scope.googleContacts[userContact.email] && !manual) {
          scope.googleContacts[userContact.email].sendingInvite = true;
        } else {
          scope.sendingInvite = true;
        }

        var params = {
          contacts: [userContact],
        };

        scope.emailService.sendMessageToMany(params, function(err, res) {

          if (scope.googleContacts[userContact.email] && !manual) {
            scope.googleContacts[userContact.email].sendingInvite = false;
          } else {
            scope.sendingInvite = false;
          }

          if (err) {
            return;
          }

          if (res) {
            if (scope.googleContacts[userContact.email] && !manual) {
              scope.googleContacts[userContact.email].invited = true;
            } else {
              scope.contacts.push(userContact);
            }
          }
        });

      };

      scope.closeModal = function() {
        scope.$parent.closeModal();
      };

      switch (scope.context) {
        case 'gmail': {
          scope.fetchGmailEmails();
          break;
        }
        case 'email': {
          scope.view('manual');
          break;
        }
      }
    },
  };
};
