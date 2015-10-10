var ENACTEDSIGNED = 'enacted-signed';

function Bill(data) {
  this.billData = data;

}

Bill.prototype.getStatusClass = function() {
  var status = this.billData.status;
  switch (status) {
    case 'ENACTED:SIGNED':
      return ENACTEDSIGNED
      break;
  }
};

Bill.prototype.getTitle = function() {
  return this.billData.short_title;
};

module.exports = Bill;

