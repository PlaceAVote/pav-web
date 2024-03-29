var config = require('../config/endpoints');
var questionFactory = require('../factories/question_factory.js');


/**
 * Get Questions makes a get request for a list of questions for a given user.
 */
function getQuestions(Resource, authService, options, callback) {
  options = options || {};
  var factory = options.questionFactory || questionFactory;
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
    callback(undefined, factory.generate(result));
    return;
  };

  request.getQuestions(undefined, onLoad, onError);
}

/**
 * Answer Questions method, makes a post request with the given answers.
 */
function answerQuestions(Resource, authService, answers, callback) {
  if (!Resource || !authService) {
    callback('Request and AuthService are required');
    return;
  }

  if (!answers || answers.length === 0) {
    callback('Answers are required');
    return;
  }

  var token = authService.getAccessToken();
  if (!token) {
    callback('Token is needed to answer questions');
    return;
  }

  config.methods.postArray.headers.Authorization = token;
  var request = new Resource(config.users.questions, undefined, {answerQuestions: config.methods.postArray});

  var onError = function(err) {
    callback(err);
    return;
  };
  var onLoad = function() {
    callback();
    return;
  };
  var body = {
    answers: answers,
  };
  request.answerQuestions(body, onLoad, onError);
}

/**
 * Question service interface definition.
 */
function QuestionService(resource, authService, options) {
  return {
    getQuestions: function(callback) {
      getQuestions(resource, authService, options, callback);
    },
    answerQuestions: function(answers, callback) {
      answerQuestions(resource, authService, answers, callback);
    },
  };
}

module.exports = QuestionService;
