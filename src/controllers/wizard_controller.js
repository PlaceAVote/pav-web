function WizardController($scope) {
  $scope = $scope || {};
  $scope.wizard = this;
  this.questions = [];
  this.answered = [];
  this.skipped = [];
}

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
