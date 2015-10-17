var expect = require('chai').expect;
var BillController = require('../../src/controllers/bill_controller.js');
var Bill = require('../../src/models/bill.js');
var Comment = require('../../src/models/comment.js');
var Legislator = require('../../src/models/legislator.js');
var CurrentVote = require('../../src/models/current_vote.js');
var topCommentsFixtures = require('../fixtures/top_comments.js');

describe('BillController', function(){
  var scope = {};
  var routeParams = {
    id: '100'
  };
  it('gets id from url', function(){
    var mockBillService = {
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        }
        callback(undefined, result);
      },
    };
    var mockVoteService = {
      getVotesForBill: function(id, callback){
        callback(undefined, new CurrentVote('hr2-114', 100, 180));
      },
    };
    var billController = new BillController(undefined, routeParams, mockBillService, undefined, mockVoteService);
    expect(billController.id).to.eql('100');
  });
  it('assigns this to scope.bill', function(){
    var mockBillService = {
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        }
        callback(undefined, result);
      },
    };
    var mockLegislationService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var mockVoteService = {
      getVotesForBill: function(id, callback){
        callback(undefined, new CurrentVote('hr2-114', 100, 180));
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
    expect(scope.bill.id).to.eql('100');
  });
  it('sets scope.body to result of BillService callback', function(done){
    var bill = new Bill({
      id: 10,
      sponsor: {
        thomas_id: '99'
      },
    });
    var mockBillService = {
      getBill: function(id, callback){
        callback(undefined, bill);
      },
      getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        }
        callback(undefined, result);
      },
    };
    var mockLegislationService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var mockVoteService = {
      getVotesForBill: function(id, callback){
        callback(undefined, new CurrentVote('hr2-114', 100, 180));
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
    billController.getBill('100');
    expect(scope.bill.body).to.eql(bill);
    done();
  });
  it('sets scope.error to true if callback has error', function(done){
    var mockBillService = {
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        }
        callback(undefined, result);
      },
    };
    var mockVoteService = {
      getVotesForBill: function(id, callback){
        callback(undefined, new CurrentVote('hr2-114', 100, 180));
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService, undefined, mockVoteService);
    billController.getBill('100');
    expect(scope.bill.error).to.eql(true);
    done();
  });
  describe('Get Comment For Bill', function(){
    it('sets topComment attribute', function(done){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        }
        callback(undefined, result);
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, undefined, mockVoteService);
      billController.getTopComments('100');
      console.log(scope.bill);
      expect(scope.bill.forComment).to.eql(new Comment(topCommentsFixtures['for-comment']));
      expect(scope.bill.againstComment).to.eql(new Comment(topCommentsFixtures['against-comment']));
      done();
    });
    it('set topCommentError to be true when server returns error', function(done){
      var comment = new Comment({
        id: 10,
      });
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, undefined, mockVoteService);
      billController.getTopComments('100');
      expect(scope.bill.forComment).to.eql(undefined);
      expect(scope.bill.topCommentError).to.eql(true);
      done();
    });
  });
  describe('Get Legislator', function(){
    it('set legislator from returned service result', function(){
      var legislationJSON = require('../fixtures/legislator.js');
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback(undefined, new Legislator(legislationJSON));
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.getLegislator({thomas_id: '10'});
      expect(scope.bill.legislator.properties).to.eql(legislationJSON);
    });
    it('set legislation error to true is service returns error', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService) ;
      billController.getLegislator({thomas_id: '10'});
      expect(scope.bill.legislator).to.eql(undefined);
      expect(scope.bill.legislatorError).to.eql(true);
    });
  });
  describe('Get Current Vote', function(){
    it('gets the current vote for a bill', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.getVotes('hr2-114');
      expect(scope.bill.voteError).to.eql(undefined);
      expect(scope.bill.currentVotes.yes).to.eql(100);
      expect(scope.bill.currentVotes.no).to.eql(180);
    });
    it('sets error when server returns error', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('ERROR!');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.getVotes('hr2-114');
      expect(scope.bill.voteError).to.eql(true);
      expect(scope.bill.currentVotes).to.eql(undefined);
    });
    it('sets error when server returns error', function(done){
      var mockBillService = {
        getBill: function(id, callback){
          var bill = new Bill({
            id: 100,
            sponsor: {
              thomas_id: '99'
            },
          });
          return callback(undefined, bill);
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('ERROR!');
        },
        voteOnBill: function(id, vote, callback){
          expect(id).to.eql('100');
          expect(vote).to.eql(true);
          callback('ERROR');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.voteOnBill(true);
      expect(scope.bill.voteFailed).to.eql(true);
      expect(scope.bill.userVoted).to.eql(undefined);
      done();
    });
    it('sets user voted when server returns true', function(done){
      var mockBillService = {
        getBill: function(id, callback){
          var bill = new Bill({
            id: 100,
            sponsor: {
              thomas_id: '99'
            },
          });
          return callback(undefined, bill);
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('ERROR!');
        },
        voteOnBill: function(id, vote, callback){
          expect(id).to.eql('100');
          expect(vote).to.eql(true);
          callback(undefined, true);
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.voteOnBill(true);
      expect(scope.bill.voteFailed).to.eql(undefined);
      expect(scope.bill.userVoted).to.eql(true);
      done();
    });
    it('vote modal changes state when called', function(){
      var mockBillService = {
        getBill: function(id, callback){
          var bill = new Bill({
            id: 100,
            sponsor: {
              thomas_id: '99'
            },
          });
          return callback(undefined, bill);
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('ERROR!');
        },
        voteOnBill: function(id, vote, callback){
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      expect(scope.bill.showVote).to.eql(undefined);
      billController.showVoteModel();
      expect(scope.bill.showVote).to.eql(true);
      billController.showVoteModel();
      expect(scope.bill.showVote).to.eql(false);
    });
  });
});

