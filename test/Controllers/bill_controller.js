var expect = require('chai').expect;
var BillController = require('../../src/controllers/bill_controller.js');
var Bill = require('../../src/models/bill.js');
var Comment = require('../../src/models/comment.js');
var Legislator = require('../../src/models/legislator.js');
var CurrentVote = require('../../src/models/current_vote.js');
var topCommentsFixtures = require('../fixtures/top_comments.js');

describe('BillController', function() {
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
          callback({status: 409});
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.vote = true;
      billController.voteOnBill();
      expect(scope.bill.userAlreadyVoted).to.eql(true);
      expect(scope.bill.userVoted).to.eql(true);
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
      billController.vote = true;
      billController.voteOnBill();
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
      billController.showVoteModel(true);
      expect(scope.bill.showVote).to.eql(true);
      expect(scope.bill.voteModal.message).to.eql('Are you sure you want to vote in favor of this bill');
      expect(scope.bill.voteModal.button).to.eql('Vote in Favor');
      expect(scope.bill.vote).to.eql(true);
      billController.showVoteModel(false);
      expect(scope.bill.voteModal.message).to.eql('Are you sure you want to vote against this bill');
      expect(scope.bill.voteModal.button).to.eql('Vote Against');
      expect(scope.bill.showVote).to.eql(true);
    });
    it('hide modal and reset vote state', function(){
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
      billController.hideVoteModal();
      expect(scope.bill.showVote).to.eql(false);
      expect(scope.bill.vote).to.eql(undefined);
    });
    it('show modal doesnt change state of vote after the vote has been processed', function(){
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
      expect(scope.bill.userVoted).to.eql(undefined);
      billController.showVoteModel(false);
      expect(scope.bill.showVote).to.eql(true);
      expect(scope.bill.vote).to.eql(false);
      billController.userVoted = true;
      expect(scope.bill.showVote).to.eql(true);
      expect(scope.bill.vote).to.eql(false);
    });
    it('hide modal only changes vote state when user has not voted', function(){
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
      expect(scope.bill.userVoted).to.eql(undefined);
      expect(scope.bill.vote).to.eql(undefined);
      billController.showVoteModel(false);
      expect(scope.bill.showVote).to.eql(true);
      expect(scope.bill.vote).to.eql(false);
      billController.userVoted = true;
      billController.hideVoteModal();
      expect(scope.bill.showVote).to.eql(false);
      expect(scope.bill.vote).to.eql(false);
    });
    it('does not set comment card if comment is not defined', function(){
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
          var result = {
            forComment: new Comment,
            againstComment: new Comment,
          };
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
          callback('ERROR!');
        },
        voteOnBill: function(id, vote, callback){
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.generateCommentCard();
      expect(billController.commentCard).to.eql(undefined);
    });
    it('sets commentcards properties based on comment', function(){
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
          var result = {
            forComment: new Comment,
            againstComment: new Comment,
          };
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
          callback('ERROR!');
        },
        voteOnBill: function(id, vote, callback){
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      var options = {
        author: 'Paul Barber',
        body: 'This Comment',
        bill_id: '10',
        score: 1,
        id: '007',
      };
      var com = new Comment(options);
      billController.generateCommentCard(com);
      var expected = {
        author: 'Paul Barber',
        body: 'This Comment',
        set: true,
        score: 1,
        status: 'PAUL BARBER DISAGREES, HE THINKS:',
        id: '007',
      };
      expect(billController.commentCard).to.eql(expected);
    });
    it('returns undefined if the comment has no author', function(){
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
          var result = {
            forComment: new Comment,
            againstComment: new Comment,
          };
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
          callback('ERROR!');
        },
        voteOnBill: function(id, vote, callback){
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      var options = {
        body: 'This Comment',
        bill_id: '10',
        score: 1,
        id: '007',
      };
      var com = new Comment(options);
      billController.generateCommentCard(com);
      expect(billController.commentCard).to.eql(undefined);
    });
    it('get comments sets all comment error to true if error from server', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        getComments: function(id, from, callback) {
          callback('Error');
        }
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('Error');
        },
        voteOnBill: function(id, vote, callback){
          callback('Error');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.getComments();
      expect(billController.allCommentError).to.eql(true);
    });
    it('On Success Adds Comments to Scope and Increases from by 10', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        getComments: function(id, from, callback) {
          callback(undefined, [new Comment({id: 1}), new Comment({id: 2})]);
        }
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('Error');
        },
        voteOnBill: function(id, vote, callback){
          callback('Error');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      expect(billController.comments.length).to.eql(2);
      expect(billController.comments[0].id).to.eql(1);
      expect(billController.from).to.eql(10);
      expect(billController.comments[1].id).to.eql(2);
    });
  });
  describe('Post Comment On Bill', function(){
    it('sets postCommentError to true when fails', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        getComments: function(id, from, callback) {
          callback('Error');
        },
        postComment: function(id, comment, callback) {
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
          callback('Error');
        },
        voteOnBill: function(id, vote, callback){
          callback('Error');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.postComment();
      expect(billController.postCommentError).to.eql(true);
    });
    it('clears message state and adds added message to comments list', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        getComments: function(id, from, callback) {
          callback(undefined, []);
        },
        postComment: function(id, comment, callback) {
          var c = new Comment();
          c.id = 1;
          return callback(undefined, c);
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback('Error');
        },
        voteOnBill: function(id, vote, callback){
          callback('Error');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService);
      billController.postComment();
      expect(billController.commentBody).to.eql(undefined);
      expect(billController.comments.length).to.eql(1);
      expect(billController.comments[0].id).to.eql(1);
    });
  });
});

