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

  describe('getSurronding', function() {
    it('returns the top 5 districts if their are less than 5 items in the league', function() {
      var subject = new DistrictLeague({ total: 3, league: [ { state: 'CA', district: 33, hits: 3 } ] });
      var selectionLeague = subject.getSurrounding();
      expect(selectionLeague).to.eql([ { state: 'CA', district: 33, hits: 3 } ]);
    });

    it('returns the 5 states & districts surrounding the current state and district', function() {
      var options = {
        state: 'CA',
        district: 6,
        total: 200,
        league: [
          { state: 'CA', district: 11, hits: 25 },
          { state: 'NY', district: 11, hits: 23 },
          { state: 'NY', district: 14, hits: 22 },
          { state: 'CA', district: 22, hits: 20 },
          { state: 'PA', district: 11, hits: 20 },
          { state: 'CA', district: 6, hits: 20 },
          { state: 'NY', district: 12, hits: 17 },
          { state: 'NY', district: 22, hits: 16 },
          { state: 'PA', district: 13, hits: 15 },
          { state: 'CA', district: 13, hits: 12 },
          { state: 'NY', district: 13, hits: 10 },
        ],
      };
      var subject = new DistrictLeague(options);
      var selectionLeague = subject.getSurrounding();
      expect(selectionLeague).to.eql([
          { state: 'CA', district: 22, hits: 20, position: 4, },
          { state: 'PA', district: 11, hits: 20, position: 5, },
          { state: 'CA', district: 6, hits: 20, current: true, position: 6, },
          { state: 'NY', district: 12, hits: 17, position: 7, },
          { state: 'NY', district: 22, hits: 16, position: 8, },
      ]);
    });

    it('returns top 5 when current state and district arent in the array', function() {
      var options = {
        state: 'CA',
        district: 10,
        total: 200,
        league: [
          { state: 'CA', district: 11, hits: 25 },
          { state: 'NY', district: 11, hits: 23 },
          { state: 'NY', district: 14, hits: 22 },
          { state: 'CA', district: 22, hits: 20 },
          { state: 'PA', district: 11, hits: 20 },
          { state: 'CA', district: 6, hits: 20 },
          { state: 'NY', district: 12, hits: 17 },
          { state: 'NY', district: 22, hits: 16 },
          { state: 'PA', district: 13, hits: 15 },
          { state: 'CA', district: 13, hits: 12 },
          { state: 'NY', district: 13, hits: 10 },
        ],
      };
      var subject = new DistrictLeague(options);
      var selectionLeague = subject.getSurrounding();
      expect(selectionLeague).to.eql([
          { state: 'CA', district: 11, hits: 25, position: 1 },
          { state: 'NY', district: 11, hits: 23, position: 2 },
          { state: 'NY', district: 14, hits: 22, position: 3 },
          { state: 'CA', district: 22, hits: 20, position: 4 },
          { state: 'PA', district: 11, hits: 20, position: 5 },
      ]);
    });

    it('returns bottom 5 when current state and district is the last index in the array', function() {
      var options = {
        state: 'NY',
        district: 13,
        total: 200,
        league: [
          { state: 'CA', district: 11, hits: 25 },
          { state: 'NY', district: 11, hits: 23 },
          { state: 'NY', district: 14, hits: 22 },
          { state: 'CA', district: 22, hits: 20 },
          { state: 'PA', district: 11, hits: 20 },
          { state: 'CA', district: 6, hits: 20 },
          { state: 'NY', district: 12, hits: 17 },
          { state: 'NY', district: 22, hits: 16 },
          { state: 'PA', district: 13, hits: 15 },
          { state: 'CA', district: 13, hits: 12 },
          { state: 'NY', district: 13, hits: 10 },
        ],
      };
      var subject = new DistrictLeague(options);
      var selectionLeague = subject.getSurrounding();
      expect(selectionLeague).to.eql([
          { state: 'NY', district: 12, hits: 17, position: 7, },
          { state: 'NY', district: 22, hits: 16, position: 8, },
          { state: 'PA', district: 13, hits: 15, position: 9 },
          { state: 'CA', district: 13, hits: 12, position: 10 },
          { state: 'NY', district: 13, hits: 10, current: true, position: 11 },
      ]);
    });
  });
  describe('generateLeague', function() {
    it('returns a subsection of the league populate for the view', function() {
      var options = {
        state: 'NY',
        district: 13,
        total: 200,
        league: [
          { state: 'CA', district: 11, hits: 25 },
          { state: 'NY', district: 11, hits: 23 },
          { state: 'NY', district: 14, hits: 22 },
          { state: 'CA', district: 22, hits: 20 },
          { state: 'PA', district: 11, hits: 20 },
          { state: 'CA', district: 6, hits: 20 },
          { state: 'NY', district: 12, hits: 17 },
          { state: 'NY', district: 22, hits: 16 },
          { state: 'PA', district: 13, hits: 15 },
          { state: 'CA', district: 13, hits: 12 },
          { state: 'NY', district: 13, hits: 10 },
        ],
      };
      var subject = new DistrictLeague(options);
      var selectionLeague = subject.generateLeague();
      expect(selectionLeague).to.eql([
          { state: 'NY', district: 12, hits: 17, percentage: '9%', position: 7, },
          { state: 'NY', district: 22, hits: 16, percentage: '8%', position: 8,},
          { state: 'PA', district: 13, hits: 15, percentage: '8%', position: 9,},
          { state: 'CA', district: 13, hits: 12, percentage: '6%', position: 10,},
          { state: 'NY', district: 13, hits: 10, current: true, percentage: '5%', position: 11 },
      ]);
    });
  });
});
