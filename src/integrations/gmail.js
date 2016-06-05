var GMAIL_SRC = 'https://apis.google.com/js/client.js';
var SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];
var CLIENT_ID = '669186541269-rhcqafutbk80ffvshmupbq0sjkdvhfae.apps.googleusercontent.com';
var googleApi;

// Loads the script on page load and sets the gapi vairable;
var importScript = (function(oHead) {
  function loadError(oError) {
    throw new URIError('The script ' + oError.target.src + ' is not accessible.');
  }

  return function(sSrc, fOnload) {
    var oScript = document.createElement('script');
    oScript.type = 'text\/javascript';
    oScript.onerror = loadError;
    if (fOnload) { oScript.onload = fOnload; }
    oHead.appendChild(oScript);
    oScript.src = sSrc;
  }
})(document.head || document.getElementsByTagName('head')[0]);

importScript(GMAIL_SRC, function() {
  // Goodle Api has loaded
  googleApi = gapi;
});

function loadContacts(callback) {
  console.log('in action');
  console.log(googleApi);
  var request = googleApi.client.gmail.users.labels.list({
    'userId': 'me',
  });

  request.execute(function(resp) {
    console.log(resp);
    callback(resp);
  });
}

function loadGmailApi(action, callback) {
  googleApi.client.load('contacts', 'v3', function() {
    console.log('actioned');
    action(callback);
  });
}

function handleAuthResult(authResult, action, callback) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // AuthorizeDiv.style.display = 'none';
    loadGmailApi(action, callback);
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

function authorize(action, callback) {
  console.log('start', googleApi);
  if (!googleApi) {
    return setTimeout(function() {
      console.log('auth');
      authorize(action, callback);
    }, 1000);
  }
  console.log('hello');
  googleApi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false,
  }, function(resp) {
      console.log('world');
      console.log('RESP', resp);
      handleAuthResult(resp, action, callback);
    });
}


module.exports = {
  loadContacts: function(callback) {
    authorize(loadContacts, callback)
  },
};
