var Comment = require('../models/comment.js');
var AuthorizeController = require('./autherize_controller.js');
function BillController($scope, $routeParams, billService, legislatorService, voteService, commentService, $location, authService) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  $scope = $scope || {};
  $scope.bill = this;
  $scope.commentService = commentService;
  this.authService = authService;
  this.location = $location;
  this.from = 0;
  this.commentBody;
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
}

BillController.prototype.showVoteModal = function(vote){
    if (!this.userVoted) {
      this.vote = vote;
      if(vote){
        this.voteModal.message = "Are you sure you want to vote in favor of this bill";
        this.voteModal.button = "Vote in Favor";
        this.voteModal.colour = "btn-green";
        this.voteModal.icon = "icon-arrow-up";
      }
      else{
        this.voteModal.message = "Are you sure you want to vote against this bill";
        this.voteModal.button = "Vote Against";
        this.voteModal.colour = "btn-red";
        this.voteModal.icon = "icon-arrow-down";
      }
    }
    this.showVote = true;
};

BillController.prototype.hideVoteModal = function(){
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
  this.voteService.getVotesForBill(id, function(err, result){
    if(err) {
        that.voteError = true;
    } else {
      that.currentVotes = result;
    }
  });
};

BillController.prototype.voteOnBill = function() {
  var that = this;
  this.voteService.voteOnBill(this.id, this.vote, function(err, result) {
    if(err) {
      if(err.status && err.status === 409){
        that.userAlreadyVoted = true;
      }
      else {
        that.voteFailed = true;
      }
    }
    that.chartShow = true;
    that.voteConfirmed();
  });
};

BillController.prototype.voteConfirmed = function() {
  this.userVoted = true;
  this.hasVoted = true;
  var vote = this.vote ? this.forComment : this.againstComment;
  this.generateCommentCard(vote);
  this.getVotes(this.id);
  this.getBillVotes(this.id);
};

BillController.prototype.generateCommentCard = function(comment) {
  if(!comment || !comment.author) {
    return;
  }
  this.commentCard = new Comment(comment);
  this.commentCard.set = true;
  this.commentCard.status = comment.author_first_name.toUpperCase() + " DISAGREES:";
};

BillController.prototype.getTopComments = function(id){
  var that = this;
  this.billService.getTopComments(id, function(err, result){
    that.topLoaded = true;
    if(err){
      that.topCommentError = true;
    }
    else {
      that.forComment = result.forComment;
      that.againstComment = result.againstComment;
      that.hasForComment = that.forComment.id ? true : false;
      that.hasAgainstComment = that.againstComment.id ? true : false;
    }
  });
};

BillController.prototype.getLegislator = function(legislator){
  var that = this;
  if(!legislator){
    return;
  }
  var id = legislator.thomas_id;
  this.legislatorService.getById(id, function(err, result){
    if(err){
      that.legislatorError = true;
    }
    else {
      that.legislator = result;
    }
  });
};

BillController.prototype.getBill = function(id) {
  var that = this;
  this.billService.getBill(id, function(err, result) {
    if (err) {
      that.error = true;
    }
    else {
      that.body = result;
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
    }
    else {
      that.stats = result;
      console.log(that.stats);
      if(that.stats.length > 1) {
        that.chartShow = true;
      }
    }
  });
};

BillController.prototype.getComments = function() {
  var that = this;
  if(!this.billService || !this.billService.getComments) {
    return;
  }
  this.billService.getComments(this.id, this.from,function(err, result) {
    if (err) {
      that.allCommentError = true;
    }
    else if (result) {
      that.comments = result;
      that.comments.length ? that.commentMessage = false : that.commentMessage = true;
      that.from = that.from + 10;
    }
  });
};

BillController.prototype.postComment = function() {
  var that = this;
  if(!this.billService || !this.billService.postComment) {
    return;
  };
  this.billService.postComment(this.id, this.commentBody, function(err, result) {
    if(err) {
      that.postCommentError = true;
      if(err.message === 'Login Required') {
        that.location.path('/');
      }
    }
    else if(result) {
      that.commentMessage = false;
      that.comments.push(result);
      that.commentBody = undefined;
    }
  });
};

BillController.prototype.userVotedCheck = function() {
  var that = this;
    if(this.body.billData.voted_for || this.body.billData.voted_against) {
      that.hasVoted = true;
    } else {
      that.hasVoted = false;
    }
}


module.exports = BillController;

