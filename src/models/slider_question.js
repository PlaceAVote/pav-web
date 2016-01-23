var QuestionBase = require('./question_base.js');

function Slider(options) {
  QuestionBase.call(this, options);
}

Slider.prototype = Object.create(QuestionBase.prototype);
Slider.prototype.constructor = Slider;

module.exports = Slider;
