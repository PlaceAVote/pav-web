var LEFT = 'left';
var MIDDLE = 'middle';
var RIGHT = 'right';

var QuestionBase = require('./question_base.js');

function Slider(options) {
  options = options || {};
  QuestionBase.call(this, options);
  this.answers = splitAnswers(options.answers);
  // Instantiates at position 1 (MIDDLE).
  this.position = 1;
}

Slider.prototype = Object.create(QuestionBase.prototype);
Slider.prototype.constructor = Slider;

Slider.prototype.getPosition = function() {
  return this.answers[this.position];
};

Slider.prototype.transform = function() {
  return {
    question_id: this.id,
    answer: [this.answers[this.position]],
  };
};

function splitAnswers(answers) {
  if (!answers) {
    return;
  }

  var answerResults = [];
  if (answers[LEFT]) {
    answerResults.push(answers[LEFT]);
  }
  if (answers[MIDDLE]) {
    answerResults.push(answers[MIDDLE]);
  }
  if (answers[RIGHT]) {
    answerResults.push(answers[RIGHT]);
  }
  return answerResults;
}

module.exports = Slider;
