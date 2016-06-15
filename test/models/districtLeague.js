var expect = require('chai').expect;
var DistrictLeague = require('../../src/models/districtLeague.js');

describe('District League', function() {
  describe('Initialisation', function() {
    it('can be populated on instantiation', function() {
      var options = {
        state: 'CA',
        district: 33,
        total: 2,
        league: [
          {
            state: 'CA',
            district: 33,
            hits: 2,
          },
        ],
      };
      var subject = new DistrictLeague(options);
      expect(subject.state).to.eql('CA');
      expect(subject.district).to.eql(33);
      expect(subject.total).to.eql(2);
      expect(subject.league.length).to.eql(1);
      expect(subject.league[0]).to.eql({ state: 'CA', district: 33, hits: 2});
    });

    it('has default value properties', function() {
      var subject = new DistrictLeague();
      expect(subject.state).to.eql(undefined);
      expect(subject.district).to.eql(undefined);
      expect(subject.total).to.eql(0);
      expect(subject.league.length).to.eql(0);
    });
  });

  describe('isAvailable', function() {
    it('returns false when total is falsey', function() {
      var subject = new DistrictLeague({ league: [ { state: 'CA', district: 33, hits: 3 } ] });
      expect(subject.isAvailable()).to.eql(false);
    });

    it('returns false when league length is 0', function() {
      var subject = new DistrictLeague({ total: 5 });
      expect(subject.isAvailable()).to.eql(false);
    });

    it('returns false by default', function() {
      var subject = new DistrictLeague();
      expect(subject.isAvailable()).to.eql(false);
    });

    it('returns false when total is truthey and league length is > 0', function() {
      var subject = new DistrictLeague({ total: 3, league: [ { state: 'CA', district: 33, hits: 3 } ] });
      expect(subject.isAvailable()).to.eql(true);
    });
  });

  describe('setState', function() {
    it('sets the value of the state property', function() {
      var subject = new DistrictLeague();
      subject.setState('CA');
      expect(subject.state).to.eql('CA');
    });
  });

  describe('setDistrict', function() {
    it('sets the value of the district property', function() {
      var subject = new DistrictLeague();
      subject.setDistrict(3);
      expect(subject.district).to.eql(3);
    });
  });

  describe('populate', function() {
    it('sets the value of the league and total properties', function() {
      var subject = new DistrictLeague();
      subject.populate({ total: 3, league: [ { state: 'CA', district: 33, hits: 3 } ] });
      expect(subject.total).to.eql(3);
      expect(subject.league.length).to.eql(1);
      expect(subject.league[0]).to.eql({ state: 'CA', district: 33, hits: 3 });
    });
  });
});
