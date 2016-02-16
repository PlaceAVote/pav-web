var Slider = require('../models/slider_question.js');
var DragAndDrop = require('../models/drag_and_drop_question.js');
/**
 * Takes an array of raw json questions and
 * returns an array of question/answer models.
 */
function generate(results) {
  var questions = results.map(function(value, index, array) {
    switch (value.question_type) {
      case 'slider': {
        return new Slider(value);
      }
      case 'dragdrop': {
        return new DragAndDrop(value);
      }
    }
    return {};
  });

  return questions;
}

var questionFactory = {
  generate: generate,
};

module.exports = questionFactory;
