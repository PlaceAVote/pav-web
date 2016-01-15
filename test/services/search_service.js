var SearchService = require('../../src/services/search_service.js');
var SearchResults = require('../../src/models/search_results.js');
var expect = require('chai').expect;

describe('Search Service', function() {
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

	var mockAuthservice = {
		getAccessToken: function() {
			return 'token';
		}
	}

	it('Should create a search results object from the Search Results Model', function() {
		var subject = new SearchService(mockResource, mockAuthservice);
		subject.search(true, function(err, res) {
			expect(err).to.eql(undefined);
		}, function(err, res) {
			expect(res.bills[0].bill_id).to.equal(mockResultsObj.bills[0].bill_id);
			expect(res.bills[0].official_title).to.equal(mockResultsObj.bills[0].official_title);
			expect(res.bills[0].short_title).to.equal(mockResultsObj.bills[0].short_title);
			expect(res.bills[0].subject).to.equal(mockResultsObj.bills[0].subject);
			expect(res.bills[0].type).to.equal(mockResultsObj.bills[0].type);
			expect(res.users[0].user_id).to.equal(mockResultsObj.users[0].user_id);
			expect(res.users[0].first_name).to.equal(mockResultsObj.users[0].first_name);
			expect(res.users[0].last_name).to.equal(mockResultsObj.users[0].last_name);
			expect(res.users[0].type).to.equal(mockResultsObj.users[0].type);
		});
	});

		


	it('Should return error', function() {
		var subject = new SearchService(mockErrorResource, mockAuthservice);
		subject.search(false, function(err, res) {
			expect(err).to.equal(mockError);
		});
	});

});





