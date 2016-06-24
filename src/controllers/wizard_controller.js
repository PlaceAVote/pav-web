var PAV = window.PAV || {};
var taxCalculator = require('../models/tax_calculator.js')();
var TaxMultiPart = require('../models/tax_multi_part_question.js');

function WizardController($scope, questionService, $rootScope) {
  var that = this;
  $scope = $scope || {};
  $scope.wizard = this;
  this.scope = $scope;
  this.questionService = questionService;
  this.rs = $rootScope;
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
    var multiPart = new TaxMultiPart({
      question_id: '1004',
      question_type: 'tax_multi',
      extension: taxCalculator,
      scope: that.scope,
    });
    questions.push(multiPart);
    that.questions = questions;
    currentQuestion = that.getNextQuestion();
    callback(currentQuestion);
  });
};

WizardController.prototype.sendQuestions = function(callback) {
  var that = this;
  this.questionService.answerQuestions(this.answered, function() {
    that.rs.user.newUser = false;
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

  if (this.questions[this.currentQuestionIndex].type === 'tax_multi') {
    this.lastQuestion = true;
  }

  return this.questions[this.currentQuestionIndex];
};

WizardController.prototype.answerQuestion = function() {
  var question = this.currentQuestion.transform();
  if (question.question_id === '1004') {
    if (question.answer[1] === '') {
      this.setError('Please enter zip code.');
      return;
    }
  }
  this.answered.push(question);
  this.currentQuestion = this.getNextQuestion();
};

WizardController.prototype.skipQuestion = function() {
  this.skipped.push(this.currentQuestion);
  this.currentQuestion = this.getNextQuestion();
};

WizardController.prototype.setError = function(message) {
  this.errorMessage = message;
};

WizardController.prototype.closeWizard = function() {
  this.rs.user.newUser = false;
};

module.exports = WizardController;
PAV.wizardController = WizardController;
