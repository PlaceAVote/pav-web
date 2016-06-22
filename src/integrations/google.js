var GMAIL_SRC = 'https://apis.google.com/js/client.js';
var SCOPES = ['https://www.googleapis.com/auth/contacts.readonly', 'https://www.googleapis.com/auth/user.emails.read'];
var contactsFeed = 'https://www.google.com/m8/feeds/contacts/default/full?key=';
var CLIENT_ID = '669186541269-rhcqafutbk80ffvshmupbq0sjkdvhfae.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAIQ5XNxQNdYWE9e5qX63UwX-qfZr13Nes';
var googleApi;

function get(options) {
  return new Promise(function(load, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        load(JSON.parse(xhr.responseText));
      }
      if (xhr.readyState === 4 && xhr.status !== 200) {
        error(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  });
}

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
  };
})(document.head || document.getElementsByTagName('head')[0]);

importScript(GMAIL_SRC, function() {
  // Goodle Api has loaded
  googleApi = gapi;
});

function loadContacts(authResult, callback) {
  console.log(authResult.access_token);
  var options = {
    url: contactsFeed + API_KEY + '&access_token=' + authResult.access_token + '&alt=json',
    method: 'GET',
  };
  return get(options).then(function(r) {
    callback(null, r);
  }).catch(function(er) {
    callback(er);
  });
}

function handleAuthResult(authResult, action, callback) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // AuthorizeDiv.style.display = 'none';
    action(authResult, callback);
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

function authorize(action, callback) {
  if (!googleApi || !googleApi.auth) {
    return setTimeout(function() {
      authorize(action, callback);
    }, 1000);
  }
  googleApi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false,
  }, function(resp) {
    handleAuthResult(resp, action, callback);
  });
}

module.exports = function() {
  return {
    loadContacts: function(callback) {
      authorize(loadContacts, callback);
    },
  };
};
