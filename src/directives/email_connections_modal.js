var emailValidator = require('../utils/email_validation.js');

module.exports = function(google, emailService) {
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

        scope.show = true;
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

        scope.addInput = function() {
          if (!emailValidator(scope.inputContact.email)) {
            scope.inputContact.invalid = true;
            return;
          }
          scope.pushValue(scope.inputContact);
          scope.inputContact = contact();
        };

        scope.togglePage = function() {
          scope.errNoContacts = false;
          scope.errUnkown = false;
          scope.errUnauth = false;
          scope.importContacts = scope.importContacts ? false : true;
        };

        scope.close = function() {
          scope.show = false;
        };

        /**
         * Fetches contacts from the google api.
         */
        scope.fetchGmailEmails = function() {
          console.log('hit');
          var that = this;
          scope.fetching = true;
          scope.googleContactsError = false;
          scope.google.getContacts(function(err, contacts) {
            if (err) {
              scope.fetching = false;
              scope.googleContactsError = true;
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
            scope.$apply();
          });
        };

        scope.pushValue = function(value) {
          scope.contacts.push({
            email: value.email,
            name: value.name,
          });
          console.log(scope.contacts);
        };

        scope.removeValue = function(email) {
          for(contact in scope.contacts) {
            if (scope.contacts[contact].email === email) {
              delete scope.contacts[contact];
            }
          }
          console.log(scope.contacts);
        }

        /*
         * Server Interaction to send messages to users.
         */

        scope.sendMessages = function() {
          var params = {
            contacts: scope.contacts,
          };
          if (scope.message) {
            params.message = scope.message;
          }
          var that = this;
          scope.emailService.sendMessageToMany(params, function(err) {
            if (err) {
              switch (err.message) {
                case 'Invalid Params: Contacts Needed.': {
                  scope.errNoContacts = true;
                  break;
                }
                case 'Invalid Params: Auth Token Needed.': {
                  scope.errUnauth = true;
                  break;
                }
                default: {
                  scope.errUnknown = true;
                  break;
                }
              }
              return;
            }
            // Clear state
            //   - need a good way to hide this too?
            //   - and be accessible from anywhere in the app.
            scope.mesage = '';
            scope.contacts = [];
            scope.fetching = null;
            scope.googleLoadedContacts = null;
            scope.googleContacts = {};
            scope.inputContact = contact();
            scope.importContacts = true;
            scope.show = false;
          });
      }


      switch (scope.context) {
        case 'gmail':
          scope.fetchGmailEmails();
      }
    },
  };
};
