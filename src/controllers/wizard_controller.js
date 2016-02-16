var taxCalculator = require('../models/tax_calculator.js')();

function WizardController($scope, questionService) {
  var that = this;
  $scope = $scope || {};
  $scope.wizard = this;
  this.scope = $scope;
  this.questionService = questionService;
  this.questions = [];
  this.answered = [];
  this.skipped = [];
  this.loadQuestions(function(question) {
    that.currentQuestion = question;
  });
}

WizardController.prototype.loadQuestions = function(callback) {
  var that = this;
  if (!this.questionService) {
    console.log('No Question Service Defined');
    callback();
    return;
  }
  this.questionService.getQuestions(function(err, questions) {
    if (err) {
      console.log(err);
      callback();
      return;
    }
    that.questions = questions;
    currentQuestion = that.getNextQuestion();
    callback(currentQuestion);
  });
};

WizardController.prototype.sendQuestions = function(callback) {
  this.questionService.answerQuestions(this.answered, function() {
    if (callback) {
      callback();
    }
  });
};


WizardController.prototype.getNextQuestion = function() {
  if (!this.questions || this.questions.length === 0) {
    return null;
  }
  this.currentQuestionIndex = this.answered.length + this.skipped.length;

  if (this.questions.length === this.currentQuestionIndex) {
    this.sendQuestions();
    return null;
  }

  return this.questions[this.currentQuestionIndex];
};

WizardController.prototype.answerQuestion = function() {
  var question = this.currentQuestion.transform();
  this.answered.push(question);
  this.currentQuestion = this.getNextQuestion();
};

WizardController.prototype.skipQuestion = function() {
  this.skipped.push(this.currentQuestion);
  this.currentQuestion = this.getNextQuestion();
};

module.exports = WizardController;
