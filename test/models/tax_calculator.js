var expect = require('chai').expect;
var taxCalculator = require('../../src/models/tax_calculator.js')();

describe('taxCalculator', function() {

  describe('getTaxContributation', function() {
    it('returns the correct tax percentage (%10) and for salary between 0.00 and 9,275.00', function() {
      for (var i = 0; i <= 9275; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(10);
      }
    });

    it('returns the correct tax percentage (%15) for salary between 9,2756.00 and 37,650.00', function() {
      for (var i = 9276; i <= 37650; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(15);
      }
    });

    it('returns the correct tax percentage (%25) for salary between 37,651.00 and 91,150.00', function() {
      for (var i = 37651; i <= 91150; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(25);
      }
    });

    it('returns the correct tax percentage (%28) for salary between 91,151.00 and 190,150.00', function() {
      for (var i = 91151; i <= 190150; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(28);
      }
    });

    it('returns the correct tax percentage (%33) for salary between 190,151.00 and 413,350.00', function() {
      for (var i = 190151; i <= 413350; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(33);
      }
    });

    it('returns the correct tax percentage (%35) for salary between 413,351.00 and 415,050.00', function() {
      for (var i = 413351; i <= 415050; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(35);
      }
    });

    it('returns the correct tax percentage (%39.6) for salary between 415,050.00 and above', function() {
      for (var i = 415051; i <= 500000; i++) {
       var subject = taxCalculator.getTaxContributation(i);
       expect(subject.percentage).to.eql(39.60);
      }
    });

    it('returns correct usd tax contribution for 35000 salaray', function() {
      var subject = taxCalculator.getTaxContributation(35000);
      expect(subject.total).to.eql(6178);
    });
  });

  describe('monthylContributionToSector', function() {
    it('returns the contribution per month for a specific sector based upon the income provided', function() {
      var income = 35000;
      var subject = taxCalculator.monthlyContributionToSector(income, 'military');
      expect(subject).to.eql(81.34);
    });
  });

  describe('getAllMonthlyContributions', function() {
    it('returns an array of readable names and monthyly contributions for each tax category', function() {
      var subject = taxCalculator.getAllMonthlyContributions(35000);
     expect(subject.length).to.eql(14);
     expect(subject[0].name).to.eql('Military');
     expect(subject[0].contribution).to.eql(81.34);
    });
  });

});
