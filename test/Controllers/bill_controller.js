var expect = require('chai').expect;
var BillController = require('../../src/controllers/bill_controller.js');
var Bill = require('../../src/models/bill.js');
var Comment = require('../../src/models/comment.js');
var Legislator = require('../../src/models/legislator.js');
var CurrentVote = require('../../src/models/current_vote.js');
var topCommentsFixtures = require('../fixtures/top_comments.js');


var mockAuthService = {
  validateToken: function(callback) {
    return callback(true);
  }
}

var mockLocation = {
  $$path: '/',
}
describe('BillController', function() {
  var scope = {};
  var routeParams = {
    id: '100'
  };
  it('gets id from url', function(){
    var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        };
        callback(undefined, result);
      },
      fetchComments: function() {
        return;
      }
    };
    var mockVoteService = {
      getVotesForBill: function(id, callback){
        callback(undefined, new CurrentVote('hr2-114', 100, 180));
      },
    };
    var billController = new BillController(undefined, routeParams, mockBillService, undefined, mockVoteService, undefined, mockLocation, mockAuthService, {});
    expect(billController.id).to.eql('100');
  });

  it('assigns this to scope.bill', function(){
    var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComments: function(id, callback){
        var result = {
          forComment: new Comment(topCommentsFixtures['for-comment']),
          againstComment: new Comment(topCommentsFixtures['against-comment']),
        };
        callback(undefined, result);
      },
      fetchComments: function() {
        return;
      }
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
    var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
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
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
      fetchComments: function() {
        return;
      }
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
    var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
    billController.getBill('100');
    expect(scope.bill.body).to.eql(bill);
    done();
  });
  it('sets scope.error to true if callback has error', function(done){
    var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
      fetchComments: function() {
        return;
      }
    };
    var mockVoteService = {
      getVotesForBill: function(id, callback){
        callback(undefined, new CurrentVote('hr2-114', 100, 180));
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService, undefined, mockVoteService, undefined, mockLocation, mockAuthService, {});
    billController.getBill('100');
    expect(scope.bill.error).to.eql(true);
    done();
  });
  describe('Get Comment For Bill', function(){
    it('sets topComment attribute', function(done){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
      fetchComments: function() {
        return;
      }
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, undefined, mockVoteService, undefined, mockLocation, mockAuthService, {});
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
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      fetchComments: function() {
        return;
      }
      };
      var mockVoteService = {
        getVotesForBill: function(id, callback){
          callback(undefined, new CurrentVote('hr2-114', 100, 180));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, undefined, mockVoteService, undefined, mockLocation, mockAuthService, {});
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
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      fetchComments: function() {
        return;
      }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.getLegislator({thomas_id: '10'});
      expect(scope.bill.legislator.properties).to.eql(legislationJSON);
    });
    it('set legislation error to true is service returns error', function(){
      var mockBillService = {
        getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      fetchComments: function() {
        return;
      }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.getLegislator({thomas_id: '10'});
      expect(scope.bill.legislator).to.eql(undefined);
      expect(scope.bill.legislatorError).to.eql(true);
    });
  });
  describe('Get Current Vote', function(){
    it('gets the current vote for a bill', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      fetchComments: function() {
        return;
      }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.getVotes('hr2-114');
      expect(scope.bill.voteError).to.eql(undefined);
      expect(scope.bill.currentVotes.yes).to.eql(100);
      expect(scope.bill.currentVotes.no).to.eql(180);
    });
    it('sets error when server returns error', function(){
      var mockBillService = {
        getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
      fetchComments: function() {
        return;
      }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.getVotes('hr2-114');
      expect(scope.bill.voteError).to.eql(true);
      expect(scope.bill.currentVotes).to.eql(undefined);
    });
    it('sets error when server returns error', function(done){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
      fetchComments: function() {
        return;
      }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.vote = true;
      billController.voteOnBill(true);
      expect(scope.bill.userVoted).to.eql(true);
      done();
    });
    it('sets user voted when server returns true', function(done){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
        fetchComments: function() {
          return;
        }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.vote = true;
      billController.voteOnBill(true);
      expect(scope.bill.voteFailed).to.eql(undefined);
      expect(scope.bill.userVoted).to.eql(true);
      done();
    });

    it('hide modal and reset vote state', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
        fetchComments: function() {
          return;
        }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      expect(scope.bill.vote).to.eql(undefined);
    });
    it('does not set comment card if comment is not defined', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
        fetchComments: function() {
          return;
        }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.generateCommentCard();
      expect(billController.commentCard).to.eql(undefined);
    });
    it('sets commentcards properties based on comment', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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
        fetchComments: function() {
          return;
        }
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      var options = {
        author_first_name: 'Paul',
        body: 'This Comment',
        bill_id: '10',
        score: 1,
        id: '007',
      };
      var com = new Comment(options);
      billController.generateCommentCard(com);
      var expected = {
        author_first_name: 'Paul',
        body: 'This Comment',
        set: true,
        score: 1,
        status: 'PAUL BARBER DISAGREES:',
        id: '007',
      };
      // expect(billController.commentCard.author_first_name).to.eql(expected.author_first_name);
      // expect(billController.commentCard.body).to.eql(expected.body);
      // expect(billController.commentCard.set).to.eql(expected.set);
      // expect(billController.commentCard.score).to.eql(expected.score);
      // expect(billController.commentCard.status).to.eql(expected.status);
      // expect(billController.commentCard.id).to.eql(expected.id);
    });
    it('returns undefined if the comment has no author', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
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

        fetchComments: function() {
          return;
        }

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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
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
    it('On Success Adds Comments to Scope and Increases from by 10', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        fetchComments: function(id, order, from, undefined, callback) {
          callback(undefined, {comments: [new Comment({id: 1}), new Comment({id: 2})]});
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      expect(billController.comments.length).to.eql(2);
      expect(billController.comments[0].id).to.eql(1);
      expect(billController.comments[1].id).to.eql(2);
    });
  });
  describe('Post Comment On Bill', function(){
    it('sets postCommentError to true when fails', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        fetchComments: function(id, order, from, undefined, callback) {
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
      var mockTimeout = function(c) {
        return c;
      }
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {}, mockTimeout);
      billController.postComment();
      expect(billController.postCommentError).to.eql(true);
    });
    it('clears message state and adds added message to comments list', function(){
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        fetchComments: function(id, order, from, undefined, callback) {
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
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {});
      billController.postComment();
      expect(billController.commentBody).to.eql(undefined);
      expect(billController.commentMessage).to.eql(false);
    });

    it('should return error if comment contains script tag', function() {
      var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        fetchComments: function(id, order, from, undefined, callback) {
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
      var mockTimeout = function() {return;};      
      var subject = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockLocation, mockAuthService, {}, mockTimeout);
      subject.commentBody = '<script></script>';
      subject.postComment();
      expect(subject.commentBody).to.equal('');
    });
  });

  it('shoould convert path to correct view', function() {
    var mockView = {
       $$path: '/comments',
    }
       var mockBillService = {
      getBillVotes: function(id, callback){
        callback('Error');
      },
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComments: function(id, callback){
          callback('Error');
        },
        fetchComments: function(id, order, from, undefined, callback) {
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
      var mockTimeout = function() {return;};      
    var subject = new BillController(scope, routeParams, mockBillService, mockLegislationService, mockVoteService, undefined, mockView, mockAuthService, {}, mockTimeout);
    expect(subject.view).to.equal('comments');
  });
});

//viewToggle

