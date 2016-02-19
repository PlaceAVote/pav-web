var Comment = require('../models/comment.js');
var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var tweet = require('../models/tweet.js');

function BillController($scope, $routeParams, billService, legislatorService, voteService, commentService, $location, authService, $rootScope, $timeout, facebook) {
  $scope = $scope || {};
  $scope.bill = this;
  $scope.commentService = commentService;
  this.timeout = $timeout;
  this.rs = $rootScope;
  this.rs.inApp = true;
  this.authService = authService;
  this.location = $location;
  this.routeParams = $routeParams;
  this.facebook = facebook;
  this.from = 0;
  this.commentBody = undefined;
  this.commentService = commentService;
  this.billService = billService;
  this.legislatorService = legislatorService;
  this.voteService = voteService;
  this.Identify($routeParams);
  this.getBill(this.id);
  this.getTopComments(this.id);
  this.getVotes(this.id);
  this.getBillVotes(this.id);
  this.getComments();
  this.voteModal = {};
  this.stats = {};
  this.readmore = false;
  this.showChart = true;
  this.authenticate();
}

BillController.prototype.authenticate = function() {
  var that = this;
  if (!that.authService) {
    return;
  }
  that.authService.validateToken(function(result) {
    that.validated = result;
    that.rs.notLoggedIn = true;
  });
};

BillController.prototype.getLocation = function() {
  var t = tweet();
  return t.generateLink(window.location.href);
};

BillController.prototype.getShareMessage = function() {
  var t = tweet();
  return t.generateMessage('Check out this bill @placeavote');
};

BillController.prototype.shareToFacebook = function() {
  var t = tweet();
  var link = t.generateLink(window.location.href);
  this.facebook.share(link);
};

BillController.prototype.validationHandler = function() {
  if (this.validated) {
    return true;
  }
  var event = new CustomEvent('not-valid', { detail: 'Invalid request', controller: 'Bill' });
  document.body.dispatchEvent(event);
  return false;
};

BillController.prototype.showVoteModal = function(vote) {
  if (!this.validationHandler(this.validated)) {
    return;
  }

  if (!this.userVoted) {
    this.vote = vote;
    if (vote) {
      this.voteModal.message = 'Are you sure you want to vote in favor of this bill';
      this.voteModal.button = 'Vote in Favor';
      this.voteModal.colour = 'btn-green';
      this.voteModal.icon = 'icon-arrow-up';
    } else {
      this.voteModal.message = 'Are you sure you want to vote against this bill';
      this.voteModal.button = 'Vote Against';
      this.voteModal.colour = 'btn-red';
      this.voteModal.icon = 'icon-arrow-down';
    }
  }
  this.showVote = true;
};

BillController.prototype.hideVoteModal = function() {
  if (!this.userVoted) {
    this.vote = undefined;
  }
  this.showVote = false;
};

BillController.prototype.Identify = function(routeParams) {
  this.id = routeParams.id;
};

BillController.prototype.getVotes = function(id) {
  var that = this;
  this.voteService.getVotesForBill(id, function(err, result) {
    if (err) {
      that.voteError = true;
    } else {
      that.currentVotes = result;
    }
  });
};

BillController.prototype.voteOnBill = function() {
  var that = this;
  if (!this.validationHandler(this.validated)) {
    return;
  }
  this.voteService.voteOnBill(this.id, this.vote, function(err, result) {
    if (err) {
      if (err.status && err.status === 409) {
        that.userAlreadyVoted = true;
      } else {
        that.voteFailed = true;
      }
    }
    that.voteConfirmed();
  });
};

BillController.prototype.voteConfirmed = function() {
  this.userVoted = true;
  this.hasVoted = true;
  var vote = this.vote ? this.forComment : this.againstComment;
  this.generateCommentCard(vote);
  this.voteShareMessage = this.generateVoteShareMessage(vote);
  this.getVotes(this.id);
  this.getBillVotes(this.id);
};

BillController.prototype.generateVoteShareMessage = function(vote) {
  var t = tweet();
  var title = '';
  if (this.body) {
    title = this.body.getTitle();
  }
  if (vote) {
    return t.generateMessage('I just voted in favour of ' + title + ' @placeavote');
  }
  return t.generateMessage('I just voted against ' + title + ' @placeavote');
};

BillController.prototype.generateCommentCard = function(comment) {
  if (!comment || !comment.author) {
    return;
  }
  this.commentCard = new Comment(comment);
  this.commentCard.set = true;
  this.commentCard.status = comment.author_first_name.toUpperCase() + ' DISAGREES:';
};

BillController.prototype.getTopComments = function(id) {
  var that = this;
  this.billService.getTopComments(id, function(err, result) {
    that.topLoaded = true;
    if (err) {
      that.topCommentError = true;
    } else {
      that.forComment = result.forComment;
      that.againstComment = result.againstComment;
      that.hasForComment = that.forComment.id ? true : false;
      that.hasAgainstComment = that.againstComment.id ? true : false;
    }
  });
};

BillController.prototype.getLegislator = function(legislator) {
  var that = this;
  if (!legislator) {
    return;
  }
  var id = legislator.thomas_id;
  this.legislatorService.getById(id, function(err, result) {
    if (err) {
      that.legislatorError = true;
    } else {
      that.legislator = result;
    }
  });
};

BillController.prototype.getBill = function(id) {
  var that = this;
  this.billService.getBill(id, function(err, result) {
    if (err) {
      that.error = true;
    } else {
      that.body = result;
      title.bill(that.body.billData);
      that.userVotedCheck();
      that.getLegislator(result.billData.sponsor);
    }
  });
};

BillController.prototype.getBillVotes = function(id) {
  var that = this;
  this.billService.getBillVotes(id, function(err, result) {
    if (err) {
      that.error = true;
    } else {
      that.stats = result;
      if (that.stats.length > 10) {
        that.chartShow = true;
      }
    }
  });
};

BillController.prototype.getComments = function() {
  var that = this;
  if (!this.billService || !this.billService.getComments) {
    return;
  }
  this.billService.getComments(this.id, this.from, this.routeParams.commentid, function(err, result) {
    if (err) {
      that.allCommentError = true;
    } else if (result) {
      that.comments = result;
      that.commentMessage = that.comments.length ? false : true;
      that.from = that.from + 10;
    }
  });
};

BillController.prototype.postComment = function() {
  var that = this;
  if (!that.validationHandler()) {
    return;
  }
  var r = new RegExp(/<script[\s\S]*?>[\s\S]*?<\/script>/gi);
  if (!this.billService || !this.billService.postComment) {
    return;
  }
  if (r.test(this.commentBody)) {
    this.commentError('Sorry, there was an error.');
    this.commentBody = '';
    return;
  }
  this.billService.postComment(this.id, this.commentBody, function(err, result) {
    if (err) {
      that.postCommentError = true;
      if (err.message === 'Login Required') {
        that.location.path('/');
      }
    } else if (result) {
      that.commentMessage = false;
      that.comments.push(result);
      that.commentBody = undefined;
    }
  });
};

BillController.prototype.commentError = function(message) {
  var that = this;
  this.errorMessage = message;
  this.timeout(function() {
    that.errorMessage = '';
  }, 2000);
};

BillController.prototype.userVotedCheck = function() {
  var that = this;
  if (this.body.billData.voted_for || this.body.billData.voted_against) {
    that.hasVoted = true;
  } else {
    that.hasVoted = false;
  }
};


module.exports = BillController;

