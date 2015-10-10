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
});
