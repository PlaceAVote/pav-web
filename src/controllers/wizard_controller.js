// Delete this.
var DragAndDrop = require('../models/drag_and_drop_question.js');

function WizardController($scope, questionService) {
  var that = this;
  $scope = $scope || {};
  $scope.wizard = this;
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
    console.log(q);
    that.questions.push(q);
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
