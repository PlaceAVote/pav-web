var QuestionBase = require('./question_base.js');

function TaxMultiPart(options) {
  QuestionBase.call(this, options);
  this.income = 0;
  this.zip = '';
  this.range = {
    min: 0,
    max: 1000000,
    step: 1000,
  };
  if (!this.scope) {
    return;
  }
  var that = this;
  this.scope.$watch('wizard.currentQuestion.income', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      that.update();
    }
  });
}

TaxMultiPart.prototype = Object.create(QuestionBase.prototype);
TaxMultiPart.prototype.constructor = TaxMultiPart;

TaxMultiPart.prototype.update = function() {
  if (!this.extension) {
    return;
  }
  this.sectors = this.extension.getAllMonthlyContributions(this.income);
  this.total = this.extension.getTaxContributation(this.income).total / 12;
};

TaxMultiPart.prototype.transform = function() {
  return {
    question_id: this.id,
    answer: [this.income, this.zip],
  };
};

// TaxMultiPart.prototype.isValid = function() {
//   return null if valid.
//   return error message.
// }

module.exports = TaxMultiPart;

