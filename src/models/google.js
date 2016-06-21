/**
 * @class Google api wrapper to be used with
 * the google api through user interaction
 * with various/multiple directives and controllers.
 */
function Google(googleApi) {
  this.googleApi = googleApi;
  this.contacts = [];
}

/**
 * GetContacts, given no errors, populate the contacts array
 * with the email addresses from the google api.
 * Triggers a user interaction through googles OAuth/Sign in.
 *
 * Contacts are stored in this instances contacts array in reverse
 * order from the google api for increased performance on interaction.
 */
Google.prototype.getContacts = function() {
  var that = this;
  this.googleApi.loadContacts(function(err, response) {
    if (err || !response.feed) {
      return;
    }
    var connections = response.feed.entry;
    var uniques = {};
    // For all connections.
    for (var connectionsLen = connections.length - 1, i = connectionsLen; i >= 0; i--) {
      var emailAddresses = connections[i].gd$email;
      // Ignore those without a gd$email property.
      // used uninverted as to not break look early.
      if (emailAddresses) {
        // For all email addresses of each connection
        for (var emailLen = emailAddresses.length - 1, j = emailLen; j >= 0; j--) {
          // Ignore undefined or empty addresses.
          if (emailAddresses[j].address) {
            // Add all unique email addresses to the hashed object.
            var name = '';
            if (connections[i].title && connections[i].title.$t) {
              name = connections[i].title.$t;
            }
            uniques[emailAddresses[j].address] = name;
          }
        }
      }
    }
    // Push all unique email addresses and names into
    // the instances contacts.
    for (var key in uniques) {
      that.contacts.push({
        email: key,
        name: uniques[key],
      });
    }
    console.log(that.contacts);
  });
};

module.exports = Google;
