function BillController($scope, $routeParams, billService, legislatorService, voteService) {
  $scope = $scope || {};
  $scope.bill = this;
  this.from = 0;
  this.billService = billService;
  this.legislatorService = legislatorService;
  this.voteService = voteService;
  this.Identify($routeParams);
  this.getBill(this.id);
  this.getTopComments(this.id);
  this.getVotes(this.id);
  this.getComments();
  this.voteModal = {};
}

BillController.prototype.showVoteModel = function(vote){
    if (!this.userVoted) {
      this.vote = vote;
      if(vote){
        this.voteModal.message = "Are you sure you want to vote in favor of this bill";
        this.voteModal.button = "Vote in Favor";
      }
      else{
        this.voteModal.message = "Are you sure you want to vote against this bill";
        this.voteModal.button = "Vote Against";
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
      that.voteConfirmed();
    }
    else {
      that.voteConfirmed();
    }
  });
};

BillController.prototype.voteConfirmed = function() {
  this.userVoted = true;
  if (this.vote) {
    this.generateCommentCard(this.forComment);
  }
  else if (this.vote) {
    this.generateCommentCard(this.againstComment);
  }
};

BillController.prototype.generateCommentCard = function(comment){
  if(!comment || !comment.author) {
    return;
  }
  this.commentCard = {
    author: comment.author,
    body: comment.body,
    id: comment.id,
    status: comment.author.toUpperCase() + " DISAGREES, HE THINKS:",
    score: comment.score,
    set: true,
  };
};

BillController.prototype.getTopComments = function(id){
  var that = this;
  this.billService.getTopComments(id, function(err, result){
    if(err){
      that.topCommentError = true;
    }
    else {
      that.forComment = result.forComment;
      that.againstComment = result.againstComment;
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
}

BillController.prototype.getBill = function(id) {
  var that = this;
  this.billService.getBill(id, function(err, result) {
    if (err) {
      that.error = true;
    }
    else {
      that.body = result;
      that.getLegislator(result.billData.sponsor);
    }
  });
};

BillController.prototype.getComments = function(){
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
      that.from = that.from + 10;
    }
  });
}

module.exports = BillController;

