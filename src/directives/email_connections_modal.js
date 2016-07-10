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
          confirm: false,
          error: false,
          success: false,
        };

        scope.view = function(view) {
          for (v in scope.views) {
            // console.log(Object.keys(scope.views[v]));
            if (view === v) {
              scope.views[view] = true;
            } else {
              scope.views[v] = false;
            }
          }
        };

          //

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
            scope.view('gmail')
            scope.$apply();
          });
        };

        scope.addGmailContact = function(value) {
            if (scope.googleContacts[value.email]) {

              if (!scope.googleContacts[value.email].added) {
                scope.googleContacts[value.email].added = true;
                scope.pushValue(value);
                return;
              } else {
                scope.googleContacts[value.email].added = false;
                scope.removeValue(value.email);
                return;
              }
            }
        }

        scope.addUserContact = function(value) {

          if(!emailValidator(value.email)) {
            scope.emailInvalid = true;
            return;
          }

          scope.emailInvalid = false;

          for(contact in scope.contacts) {
            if(scope.contacts[contact].email === value.email) {
              scope.removeValue(value.email);
              return;
            }
          }
          scope.pushValue(value);
        }

        scope.pushValue = function(value) {
          scope.contacts.unshift({
            email: value.email,
            name: value.name,
            added: true,
          });
          console.log(scope.contacts);
        };

        scope.removeValue = function(email) {
          for(contact in scope.contacts) {
            if (scope.contacts[contact].email === email) {
              scope.contacts.splice(contact,1);
            }
          }
          console.log(scope.contacts);
        };


        scope.toMessage = function() {
          if(scope.contacts.length <= 0) {
            scope.confirmationError = true;
            return;
          } else {
            scope.view('confirm');
            return;
          }
        };

        /*
         * Server Interaction to send messages to users.
         */

        scope.sendMessages = function() {
          for(contact in scope.contacts) {
            delete scope.contacts[contact].added;
          }
          var params = {
            contacts: scope.contacts,
          };
          if (scope.message) {
            params.message = scope.message;
          }
          var that = this;
          scope.confirming = true;
          scope.emailService.sendMessageToMany(params, function(err, res) {
            scope.confirming = false;
            if (err) {
              scope.view('error');
            }

            if (res) {
              scope.view('success');
            }

            scope.timeout(function() {
              scope.closeModal();
            }, 2000)
          });
      };

      scope.closeModal = function () {
        scope.$parent.closeModal();
      };

      switch (scope.context) {
        case 'gmail':
          scope.fetchGmailEmails();
          break;
        case 'email':
          scope.view('manual');
          break;
      }
    },
  };
};
