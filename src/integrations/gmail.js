var GMAIL_SRC = 'https://apis.google.com/js/client.js';
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

module.exports = {
  load: function(callback) {
    importScript(GMAIL_SRC, function() {
      callback(gapi);
    });
  },
};
