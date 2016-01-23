var LEFT = 'left';
var MIDDLE = 'middle';
var RIGHT = 'right';

var QuestionBase = require('./question_base.js');

function Slider(options) {
  QuestionBase.call(this, options);
  this.answers = splitAnswers(options.answers);
  //Instantiates at position 1 (Not Sure).
  this.position = 1;
}

Slider.prototype = Object.create(QuestionBase.prototype);
Slider.prototype.constructor = Slider;

Slider.prototype.changePosition = function(i) {
  if (this.position + i < 0) {
    return;
  }
  if (!this.answers || this.answers.length === 0) {
    this.position = null;
    return;
  }
  if (this.position + i > this.answers.length - 1) {
    return;
  }
  this.position += i;
};

Slider.prototype.transform = function() {
  return {
    question_id: this.id,
    answers: [this.answers[this.position]],
  };
};

function splitAnswers(answers) {
  if (!answers) {
    return;
  }

  var answerResults = [];
  var keys = Object.keys(answers);
  for (var i = 0; i < keys.length; i++) {
   var key = keys[i];
   switch (key) {
    case LEFT: {
      answerResults[0] = answers[key];
    }

    case MIDDLE: {
      answerResults[1] = answers[key];
    }

    case RIGHT: {
      answerResults[2] = answers[key];
    }
   }
  }
  return answerResults;
}

module.exports = Slider;
