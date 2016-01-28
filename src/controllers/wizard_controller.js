// Delete this.
var DragAndDrop = require('../models/drag_and_drop_question.js');
var Slider = require('../models/slider_question.js');
var TaxMultiPart = require('../models/tax_multi_part_question.js');
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
    var data = {
      question_id: '1002',
      question_type: 'dragdrop',
      question: 'Which of these bills interests you, drag and drop in...',
      answers: [
        {
          bill_id: 'hr2-114',
          bill_title: 'Bill to make July 3rd National Cowboy Day',
        },
        {
          bill_id: 'hr2-115',
          bill_title: 'Bill to make July 5th National Cowboy Day',
        },
      ],
    };
    var q = new DragAndDrop(data);
    data = {
      question_id: '1003',
      question_type: 'slider',
      topic: 'Gun Controll',
      answers: {
        left: 'I want less gun control',
        middle: 'Not sure',
        right: 'I want more gun control',
      },
    };
    var q1 = new Slider(data);
    data = {
      question_id: '1004',
      question_type: 'tax_multi',
      extension: taxCalculator,
      scope: that.scope,
    };
    var q2 = new TaxMultiPart(data);
    that.questions.push(q);
    that.questions.push(q1);
    that.questions.push(q2);
    currentQuestion = that.getNextQuestion();
    callback(currentQuestion);
  });
};

WizardController.prototype.getNextQuestion = function() {
  if (!this.questions || this.questions.length === 0) {
    return null;
  }
  this.currentQuestionIndex = this.answered.length + this.skipped.length;

  if (this.questions.length === this.currentQuestionIndex) {
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
