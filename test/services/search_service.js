var SearchService = require('../../src/services/search_service.js');
var SearchResults = require('../../src/models/search_results.js');
var expect = require('chai').expect;
var fixtures = require('../fixtures/search.js');

var mockAuthservice = {
  getAccessToken: function() {
    return 'token';
  }
};

describe('Search Service', function() {
  describe('Search', function() {
    var mockResults = [
      {
        bill_id: "hr312-114",
        official_title: "Glen Anthony Doherty Overseas Security Personnel Fairness Act",
        short_title: "Glen Anthony Doherty Overseas Security Personnel Fairness Act",
        subject: "Labor and employment",
        type: "bill"
      },
      {
        first_name: "Anthony",
        img_url: "face.jpg",
        last_name: "O'Neill",
        type: "users",
        user_id: "b498",
      }
    ];

    var mockError = [
      {
        "status": "404"
      }
    ];

    var mockResultsObj = new SearchResults(mockResults);

    var mockResource = function() {
      this.search = function(object, onLoad, onError) {
          onLoad(mockResults);
      }
    }
    var mockErrorResource = function() {
      this.search = function(object, onLoad, onError) {
        onError(mockError);
      }
    }

    it('Should create a search results object from the Search Results Model', function(done) {
      var subject = new SearchService(mockResource, mockAuthservice);
      subject.search(true, function(err, res) {
        expect(err).to.eql(undefined);
        expect(res.bills[0].bill_id).to.equal(mockResultsObj.bills[0].bill_id);
        expect(res.bills[0].official_title).to.equal(mockResultsObj.bills[0].official_title);
        expect(res.bills[0].short_title).to.equal(mockResultsObj.bills[0].short_title);
        expect(res.bills[0].subject).to.equal(mockResultsObj.bills[0].subject);
        expect(res.bills[0].type).to.equal(mockResultsObj.bills[0].type);
        expect(res.users[0].user_id).to.equal(mockResultsObj.users[0].user_id);
        expect(res.users[0].first_name).to.equal(mockResultsObj.users[0].first_name);
        expect(res.users[0].last_name).to.equal(mockResultsObj.users[0].last_name);
        expect(res.users[0].type).to.equal(mockResultsObj.users[0].type);
        done();
      });
    });

    it('Should return error', function(done) {
      var subject = new SearchService(mockErrorResource, mockAuthservice);
      subject.search(false, function(err, res) {
        expect(err).to.equal(mockError);
        done();
      });
    });
  });

  describe('Bills', function() {
    it('returns an array of bills', function(done) {
      var expectedParams = {};
      var tagResource = function(url, params, method) {
        expectedParams.url = url;
        expectedParams.params = params;
        expectedParams.method = method;
        this.call = function(body, onLoad, onError) {
          expectedParams.body = body;
          onLoad(fixtures.bills);
        }
      }
      var subject = new SearchService(tagResource, mockAuthservice);
      subject.bills('Drugs', function(err, results) {
        expect(err).to.eql(null);
        expect(expectedParams.url).to.contain('/bills?tag=Drugs');
        expect(expectedParams.params).to.eql(undefined);
        expect(expectedParams.body).to.eql(undefined);
        expect(expectedParams.method.call.method).to.eql('GET');
        expect(results.length).to.eql(6);
        done();
      });
    });

    it('returns an empty array on error', function(done) {
      var tagResource = function(url, params, method) {
        this.call = function(body, onLoad, onError) {
          onError(new Error('NOPE'));
        }
      }
      var subject = new SearchService(tagResource, mockAuthservice);
      subject.bills('Drugs', function(err, results) {
        expect(err).to.eql(null);
        expect(results).to.eql([]);
        done();
      });
    });

    it('returns an empty array when no tag present', function(done) {
      var subject = new SearchService({}, mockAuthservice);
      subject.bills(undefined, function(err, results) {
        expect(err).to.eql(null);
        expect(results).to.eql([]);
        done();
      });
    });
  });
});

