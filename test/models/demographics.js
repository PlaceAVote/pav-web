var expect = require('chai').expect;
var Demographics = require('../../src/models/demographics.js');
var fixtures = require('../fixtures/demographics.js');

describe('Demographics', function() {
  describe('Instantiation', function() {
    it('sets default properties', function() {
      var subject = new Demographics();
      expect(subject.available).to.eql(false);
    });
    it('sets state and district properties', function() {
      var options = {
        state: 'CA',
        district: 6,
      };
      var subject = new Demographics(options);
      expect(subject.state).to.eql('CA');
      expect(subject.district).to.eql(6);
    });
  });
  describe('setBusy', function() {
    it('sets busy property', function() {
      var subject = new Demographics();
      subject.setBusy(true);
      expect(subject.busy).to.eql(true);
      subject.setBusy(false);
      expect(subject.busy).to.eql(false);
    });
  });
  describe('getBusy', function() {
    it('gets busy property', function() {
      var subject = new Demographics();
      subject.busy = true;
      expect(subject.getBusy()).to.eql(true);
      subject.busy = false;
      expect(subject.getBusy()).to.eql(false);
    });
  });
  describe('setAvailable', function() {
    it('sets available property', function() {
      var subject = new Demographics();
      subject.setAvailable(true);
      expect(subject.available).to.eql(true);
      subject.setAvailable(false);
      expect(subject.available).to.eql(false);
    });
  });
  describe('getAvailable', function() {
    it('gets busy property', function() {
      var subject = new Demographics();
      expect(subject.getAvailable()).to.eql(false);
      subject.available = true;
      expect(subject.getAvailable()).to.eql(true);
    });
  });
  describe('setDemographics', function() {
    it('set demographics property', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.setDemographics(demographics)
      expect(subject.demographics).to.eql(demographics);
      expect(subject.demographics.votes.total).to.eql(7);
    });
  });
  describe('getRepresentationScore', function() {
    it('sets the score as a string representation', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.setDemographics(demographics)
      subject.setRepresentationScore()
      expect(subject.representationScore).to.eql('7/390');
    });
    it('wont set when demographics are not set', function() {
      var subject = new Demographics();
      subject.setRepresentationScore()
      expect(subject.representationScore).to.eql(undefined);
    });
  });
  describe('setVotePercent', function() {
    it('sets the score as a string representation', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.setDemographics(demographics)
      subject.setVotePercent()
      expect(subject.stats.length).to.eql(2);
      expect(subject.stats[0].val).to.eql(42.86);
      expect(subject.stats[0].label).to.eql('Against');
      expect(subject.stats[0].className).to.eql('against');
      expect(subject.stats[1].val).to.eql(57.14);
      expect(subject.stats[1].label).to.eql('In Favor');
      expect(subject.stats[1].className).to.eql('favor');
    });
    it('wont set when demographics are not set', function() {
      var subject = new Demographics();
      subject.setVotePercent()
      expect(subject.stats).to.eql(undefined);
    });
  });
  describe('setRepresentationPercent', function() {
    it('sets the representation percent', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.setDemographics(demographics)
      subject.setRepresentationPercent()
      expect(subject.representationPercent).to.eql(2);
    });
    it('wont set when demographics are not set', function() {
      var subject = new Demographics();
      subject.setRepresentationPercent()
      expect(subject.stats).to.eql(undefined);
    });
  });
  describe('Populate', function() {
    it('should call set functions', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      var calledCount = 0;
      subject.setDemographics = function() { calledCount++; }
      subject.setRepresentationPercent = function () { calledCount++; }
      subject.setRepresentationScore = function () { calledCount++; }
      subject.setVotePercent = function () { calledCount++; }
      subject.setAvailable = function () { calledCount++; }
      subject.setBusy = function () { calledCount++; }
      subject.setUnderRepresentedGenderGroup = function() { calledCount++; }
      subject.isUnderRepresented = function() { calledCount++; }
      subject.populate();
      expect(calledCount).to.eql(8);
    });
  });
  describe('IsUnderRepresented', function() {
    it('return true is representationPercent is less than one hundred', function() {
      var subject = new Demographics();
      subject.representationPercent = 80;
      var result = subject.isUnderRepresented();
      expect(result).to.eql(true);
    });
    it('return false is representationPercent is over 100', function() {
      var subject = new Demographics();
      subject.representationPercent = 120;
      var result = subject.isUnderRepresented();
      expect(result).to.eql(false);
    });
    it('return false is representationPercent is 100', function() {
      var subject = new Demographics();
      subject.representationPercent = 100;
      var result = subject.isUnderRepresented();
      expect(result).to.eql(false);
    });
    it('return false is representationPercent is undefined', function() {
      var subject = new Demographics();
      var result = subject.isUnderRepresented();
      expect(result).to.eql(false);
    });
  });
  describe('setUnderRepresentedGenderGroup', function() {
    it('sets an object of the gender who is most under represented in the district/state', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.populate(demographics);
      subject.setUnderRepresentedGenderGroup();
      expect(subject.underRepresentedGenderGroup.percentage).to.eql(42.86);
      expect(subject.underRepresentedGenderGroup.gender).to.eql('female');
    });
    it('does not set when demographics are not defined', function() {
      var subject = new Demographics();
      subject.setUnderRepresentedGenderGroup();
      expect(subject.underRepresentedGenderGroup).to.eql(undefined);
    });
  });
  describe('updateRepresentationView', function() {
    it('wont recalculate if 100 or more', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.populate(demographics);
      subject.representationPercent = 100;
      subject.updateRepresentation();
      expect(subject.representationPercent).to.eql(100);
    });
    it('doesnt alter percent over 100', function() {
      var subject = new Demographics();
      var demographics = fixtures;
      subject.populate(demographics);
      subject.representationPercent = 101;
      subject.updateRepresentation();
      expect(subject.representationPercent).to.eql(101);
    });
    it('updates nothing when nothing is deinfed', function() {
      var subject = new Demographics();
      subject.updateRepresentation();
      expect(subject.representationPercent).to.eql(undefined);
    });
    it('re calculates percentage when less than 100', function() {
      var subject = new Demographics();
      var demographics = JSON.parse(JSON.stringify(fixtures));
      subject.populate(demographics);
      expect(subject.representationPercent).to.eql(2);
      subject.demographics.votes.total = 100;
      subject.updateRepresentation();
      expect(subject.representationPercent).to.eql(26);
    });
  });
  describe('update vote percent', function() {
    it('increases the votes total', function() {
      var subject = new Demographics();
      var demographics = JSON.parse(JSON.stringify(fixtures));
      subject.populate(demographics);
      expect(demographics.votes.total).to.eql(7);
      subject.updateVotePercent();
      expect(demographics.votes.total).to.eql(8);
    });
    it('increases the yes votes total', function() {
      var subject = new Demographics();
      var demographics = JSON.parse(JSON.stringify(fixtures));
      subject.populate(demographics);
      expect(demographics.votes.total).to.eql(7);
      expect(demographics.votes.yes).to.eql(4);
      expect(demographics.votes.no).to.eql(3);
      subject.updateVotePercent(true);
      expect(demographics.votes.total).to.eql(8);
      expect(demographics.votes.yes).to.eql(5);
      expect(demographics.votes.no).to.eql(3);
    });
    it('increases the nay sayers', function() {
      var subject = new Demographics()
      var demographics = JSON.parse(JSON.stringify(fixtures));
      subject.populate(demographics);
      expect(demographics.votes.total).to.eql(7);
      expect(demographics.votes.yes).to.eql(4);
      expect(demographics.votes.no).to.eql(3);
      subject.updateVotePercent(false);
      expect(demographics.votes.total).to.eql(8);
      expect(demographics.votes.yes).to.eql(4);
      expect(demographics.votes.no).to.eql(4);
    });
    it('doesnt increase when demographics arent defined', function() {
      var subject = new Demographics();
      subject.updateVotePercent();
      expect(subject.demographics).to.eql(undefined);
    });
  });
  describe('setMinorityAgeRange', function() {
    it('wont set majority age range with no demographics', function() {
      var subject = new Demographics()
      subject.setMinorityAgeRange();
      expect(subject.minorityAgeRange).to.eql(undefined);
    });
    it('sets the minority age range across all genders', function() {
      var subject = new Demographics()
      var demographics = JSON.parse(JSON.stringify(fixtures));
      subject.populate(demographics);
      subject.setMinorityAgeRange();
      expect(subject.minorityAgeRange.ageRange).to.eql('60+');
      expect(subject.minorityAgeRange.percentage).to.eql(0);
    });
    it('sets the minority age range across all genders', function() {
      var subject = new Demographics()
      var demographics = JSON.parse(JSON.stringify(fixtures));
      // shouldnt alter when min age is not 60
      demographics.gender.female.ranges[6].votes.total = 100;
      subject.populate(demographics);
      subject.setMinorityAgeRange();
      expect(subject.minorityAgeRange.ageRange).to.eql('53-60');
      expect(subject.minorityAgeRange.percentage).to.eql(0);
    });
  });
});
