
function stringContains(sourceString, subString) {
    var subStringWindows = subString.replace('/', '\\');
      return sourceString.indexOf(subString) !== -1 || sourceString.indexOf(subStringWindows) !== -1;
}

module.exports = function(error) {

  var lineLength = ['web-app', 'login_controller', 'mailcheck', 'comment', 'imagecrop','issues_controller','bill_controller',];
  for (var i = 0; i < lineLength.length; i++) {
    if (stringContains(error.filename, lineLength[i]) &&
        stringContains(error.rule,'maximumLineLength')) {
      return false;
    }
  }

  var underscoredFiles = ['header_controller', 'titles', 'bill_controller', 'sign_up_controller', 'directives.js', 'nav-stick', 'search.js','models/', 'bill_service.js', 'comment_service.js', 'user_service.js', 'controllers/bill_controller.js'];

  for (var j = 0; j < underscoredFiles.length; j++) {
    if(stringContains(error.filename, underscoredFiles[j]) &&
        stringContains(error.rule, 'requireCamelCaseOrUpperCaseIdentifiers')) {
      return false;
    }
  }

  return true;
};
