var QuestionBase = require('./question_base.js');

function TaxMultiPart(options) {
  QuestionBase.call(this, options);
  this.income = 0;
  this.zip = '91210';
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
};

TaxMultiPart.prototype.transform = function() {
  return [this.income, this.zip];
};

module.exports = TaxMultiPart;

