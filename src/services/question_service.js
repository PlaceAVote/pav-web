var config = require('../config/endpoints');

function getQuestions(Resource, authService, options, callback) {
  options = options || {};
  var questionFactory = options.questionFactory;
  if (!Resource || !authService) {
    callback('Resource and AuthService must be defined');
    return;
  }
  var token = authService.getAccessToken();
  if (!token) {
    callback('No token present in question request');
    return;
  }
  config.methods.getArray.headers.Authorization = token;
  var request = new Resource(config.users.questions, undefined, {getQuestions: config.methods.getArray});

  var onError = function(err) {
    callback(err);
    return;
  };
  var onLoad = function(result) {
    callback(undefined, questionFactory.generate(result));
    return;
  };

  request.getQuestions(undefined, onLoad, onError);
}


function QuestionService(resource, authService, options) {
  return {
    getQuestions: function(callback) {
      getQuestions(resource, authService, options, callback);
    },
  };
}

module.exports = QuestionService;
