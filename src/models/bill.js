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
    case 'ENACTED:SIGNED':
      return ENACTEDSIGNED;
    case 'INTRODUCED':
      return BILLINTRODUCTED;
    case 'REPORTED':
      return COMMITTEE;
    case 'CONFERENCE:PASSED:HOUSE':
      return PASSEDHOUSE;
    case 'CONFERENCE:PASSED:SENATE':
      return PASSEDSENATE;
  }
};

Bill.prototype.getTitle = function() {
  var t = this.billData.bill_type.toUpperCase();
  var c = this.billData.congress;
  return format('%s. %s: %s', t, c, this.billData.short_title);
};

module.exports = Bill;

