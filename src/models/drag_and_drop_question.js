var QuestionBase = require('./question_base.js');

function DragAndDrop(options) {
  QuestionBase.call(this, options);
}

DragAndDrop.prototype = Object.create(QuestionBase.prototype);
DragAndDrop.prototype.constructor = DragAndDrop;

DragAndDrop.prototype.transform = function() {
  var results = {
    question_id: this.id,
  };

  results.answers = this.answers.map(function(item) {
    return item.bill_id;
  });

  return results;
};

module.exports = DragAndDrop;
