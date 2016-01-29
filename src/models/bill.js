var format = require('util').format;

var ENACTEDSIGNED = 'enacted-signed';
var PASSEDSENATE = 'passed-senate';
var PASSEDHOUSE = 'passed-house';
var COMMITTEE = 'committee';
var BILLINTRODUCTED = 'bill-introduced';

function Bill(data) {
  this.billData = data;
}

Bill.prototype.getStatusClass = function() {
  var status = this.billData.status;
  switch (status) {
    case 'ENACTED:SIGNED': {
      return ENACTEDSIGNED;
    }
    case 'REFERRED': {
      return BILLINTRODUCTED;
    }
    case 'INTRODUCED': {
      return BILLINTRODUCTED;
    }
    case 'REPORTED': {
      return COMMITTEE;
    }
    case 'CONFERENCE:PASSED:HOUSE': {
      return PASSEDHOUSE;
    }
    case 'CONFERENCE:PASSED:SENATE': {
      return PASSEDSENATE;
    }
  }
};

Bill.prototype.getTitle = function() {
  if (!this.billData && !this.billData.bill_type) {
    return;
  }
  var billType = this.billData.bill_type.toUpperCase();
  var billNumber = this.billData.number;
  var title = this.billData.short_title || this.billData.official_title || '';
  return format('%s %s: %s', billType, billNumber, title);
};

Bill.prototype.getSummary = function() {
  return this.billData.feature_summary || this.billData.summary;
};

module.exports = Bill;
