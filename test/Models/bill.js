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
    it('change css class to introduced status', function(){
      var billData = {
        status: 'INTRODUCED'
      }
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getStatusClass();
      expect(result).to.eql('bill-introduced');
    });
    it('change css class to reported status', function(){
      var billData = {
        status: 'REPORTED'
      }
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getStatusClass();
      expect(result).to.eql('committee');
    });
    it('change css class to passed house status', function(){
      var billData = {
        status: 'CONFERENCE:PASSED:HOUSE'
      }
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getStatusClass();
      expect(result).to.eql('passed-house');
    });
    it('change css class to passed senate status', function(){
      var billData = {
        status: 'CONFERENCE:PASSED:SENATE'
      }
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getStatusClass();
      expect(result).to.eql('passed-senate');
    });
  });
  describe('Get Title', function(){
    it('returns the short title', function(){
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getTitle();
      expect(result).to.eql('HR. 114: Medicare Access and CHIP Reauthorization Act of 2015');
    });
    it('uses official title when short isnt available', function(){
      billData.short_title = undefined;
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getTitle();
      expect(result).to.eql("HR. 114: To amend title XVIII of the Social Security Act to repeal the Medicare sustainable growth rate and strengthen Medicare access by improving physician payments and making other improvements, to reauthorize the Children's Health Insurance Program, and for other purposes.");
    });
    it('it has an empty string (not undefined) if no title is available', function(){
      billData.short_title = undefined;
      billData.official_title = undefined;
      var subject = new Bill(billData);
      expect(subject.billData).to.eql(billData);
      var result = subject.getTitle();
      expect(result).to.eql('HR. 114: ');
    });
  });
});
