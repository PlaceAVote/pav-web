var billData = require('../fixtures/bill.js');
var expect = require('chai').expect;
var Bill = require('../../src/models/bill.js');

describe('Bill Model', function(){
  it('is built from bill data', function(){
   var subject = new Bill(billData);
   expect(subject.billData).to.eql(billData);
  });
  it('bill data is undefined when no data given', function(){
   var subject = new Bill();
   expect(subject.billData).to.eql(undefined);
  });
  describe('GetStatus', function(){
    it('changes status into class', function(){
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getStatusClass();
      expect(result).to.eql('enacted-signed');
    });
  });
  describe('Get Title', function(){
    it('returns the short title', function(){
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getTitle();
      expect(result).to.eql('HR. 114: Medicare Access and CHIP Reauthorization Act of 2015');
    });
  });
});
