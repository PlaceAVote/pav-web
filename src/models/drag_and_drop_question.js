var QuestionBase = require('./question_base.js');

function DragAndDrop(options) {
  QuestionBase.call(this, options);
}

DragAndDrop.prototype = Object.create(QuestionBase.prototype);
DragAndDrop.prototype.constructor = DragAndDrop;

module.exports = DragAndDrop;
