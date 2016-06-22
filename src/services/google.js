/**
 * GetContacts, given no errors, populate the contacts array
 * with the email addresses from the google api.
 * Triggers a user interaction through googles OAuth/Sign in.
 *
 * Contacts are returned  in reverse order from the google
 * api for increased performance on interaction.
 */
function getContacts(googleApi, callback) {
  googleApi.loadContacts(function(err, response) {
    if (err || !response.feed) {
      return callback(err || new Error('No Feed Item Returned'));
    }
    var contacts = [];
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
      contacts.push({
        email: key,
        name: uniques[key],
      });
    }
    return callback(null, contacts);
  });
}

/**
 * Google api wrapper to be used with
 * the google api through user interaction
 * with various/multiple directives and controllers.
 */
var google = function(googleApi) {
  return {
    getContacts: function(callback) {
      return getContacts(googleApi, callback);
    },
  };
};


module.exports = google;
