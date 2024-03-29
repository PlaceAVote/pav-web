var Comment = require('../models/comment.js');
var AuthorizeController = require('./autherize_controller.js');
var Demographics = require('../models/demographics.js');
var DistrictLeague = require('../models/districtLeague.js');
var title = require('../config/titles.js');
var tweet = require('../models/tweet.js');

function BillController($scope, $routeParams, billService, legislatorService, voteService, commentService, $location, authService, $rootScope, $timeout, facebook, $route, $window) {
  $scope = $scope || {};
  $scope.bill = this;
  $scope.commentService = commentService;
  this.timeout = $timeout;
  this.rs = $rootScope || {};
  this.rs.inApp = true;
  this.window = $window;
  this.representation = new Demographics();
  this.districtLeague = new DistrictLeague();
  this.authService = authService;
  this.location = $location;
  this.routeParams = $routeParams;
  this.route = $route;
  this.facebook = facebook;
  this.from = 0;
  this.commentBody = undefined;
  this.commentService = commentService;
  this.billService = billService;
  this.legislatorService = legislatorService;
  this.voteService = voteService;
  this.views = ['summary', 'comments', 'info', 'statistics', 'representation'];
  this.Identify($routeParams);
  this.getBill(this.id);
  this.getTopComments(this.id);
  this.getVotes(this.id);
  this.fetchComments();
  this.voteModal = {};
  this.stats = {};
  this.readmore = false;
  this.showChart = true;
  this.authenticate();
  this.commentOrder = 'highest-score';
}

BillController.prototype.getDistrictLeague = function() {
  if (!this.rs || !this.rs.user) {
    return;
  }
  this.districtLeague.setState(this.rs.user.state);
  this.districtLeague.setDistrict(this.rs.user.district);

  var that = this;
  this.billService.getDistrictLeague(this.id, function(err, result) {
    if (err) {
      return;
    }
    that.districtLeague.populate(result);
  });
};

BillController.prototype.shareToTwitter = function() {
  var url = 'https://twitter.com/intent/tweet?text=' + this.getShareMessage() + '&url=' + this.getLocation();
  this.window.open(url, '_blank');
  return url;
};

BillController.prototype.authenticate = function() {
  var that = this;
  if (!that.authService) {
    return;
  }
  that.authService.validateToken(function(result) {
    that.validated = result;
    that.rs.notLoggedIn = !result;
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
  this.facebook.share(window.location.href);
};

BillController.prototype.validationHandler = function() {
  if (this.validated) {
    return true;
  }
  var event = new CustomEvent('not-valid', { detail: 'Invalid request', controller: 'Bill' });
  document.body.dispatchEvent(event);
  return false;
};


BillController.prototype.Identify = function(routeParams) {
  this.id = routeParams.id;
  this.viewToggle(this.location.$$path);
};


BillController.prototype.viewToggle = function(view) {
  var reg;
  for (var i = 0; i < this.views.length; i++) {
    reg = new RegExp(this.views[i], 'g');
    if (view.match(reg)) {
      this.view = this.views[i];
      return this.view;
    }
  }
  this.view = 'summary';

};


BillController.prototype.getVotes = function(id) {
  var that = this;
  this.voteService.getVotesForBill(id, function(err, result) {
    if (err) {
      that.voteError = true;
    } else {
      that.noVote = result.no;
      that.yesVote = result.yes;
      that.calculatePie();
    }
  });
};


BillController.prototype.voteOnBill = function(vote) {
  var that = this;
  if (!this.validationHandler(this.validated)) {
    return;
  }
  this.voteService.voteOnBill(this.id, vote, function(err, result) {
    if (err) {
      if (err.status && err.status === 409) {
        that.userAlreadyVoted = true;
      } else {
        that.voteFailed = true;
      }
    }
    that.voteConfirmed(vote);
  });
};


BillController.prototype.voteConfirmed = function(vote) {
  this.showVoteModal = false;
  this.showConfirmationModal = true;
  this.userVoted = true;
  this.hasVoted = true;
  var contrarianComment = vote ? this.againstComment : this.forComment;
  this.generateCommentCard(contrarianComment);
  this.updateRepresentationView(vote);
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
  this.commentCard.status = comment.author_first_name.toUpperCase() + ' DISAGREES WITH YOU';
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
      if (!result.billData || !result.billData.bill_id) {
        that.location.path('/feed');
        return;
      }
      that.body = result;

      if (that.body.billData.summary === 'No Summary Present...') {
        that.body.billData.noSummary = true;
      }

      if (that.body.billData.featured_img_links) {
        that.metaImageFacebook = that.body.billData.featured_img_links.facebook_url;
        that.metaImageTwitter = that.body.billData.featured_img_links.twitter_url;
      } else {
        that.metaImageFacebook = 'http://s29.postimg.org/v86d7ur2v/og_fb_img.jpg';
        that.metaImageTwitter = 'http://s29.postimg.org/v86d7ur2v/og_fb_img.jpg';
      }

      title.bill(that.body.billData);
      that.userVotedCheck();
      that.getLegislator(result.billData.sponsor);
      that.sponsorCount(result.billData.cosponsors_count);
      that.getRepresentation();
      that.getDistrictLeague();
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


BillController.prototype.fetchComments = function() {
  var that = this;
  if (this.fetchingComments) {
    return;
  }
  this.fetchingComments = true;
  this.billService.fetchComments(this.id, this.commentOrder, undefined, this.routeParams.commentid, function(err, res) {
    that.fetchingComments = false;
    if (res) {
      that.comments = res.comments;
      that.lastComment = res.lastComment;
    }

    if (err) {
      that.commentError('Sorry there was an error');
    }

  });
};


BillController.prototype.commentsCheck = function() {

  var that = this;

  if (this.checkingComments || !this.lastComment) {
    return;
  }

  this.checkingComments = true;
  this.fetchingComments = true;

  this.billService.fetchComments(this.id, this.commentOrder, this.lastComment, this.routeParams.commentid, function(err, res) {
    that.checkingComments = false;
    that.fetchingComments = false;
    if (res) {
      that.comments.push.apply(that.comments, res.comments);
      that.lastComment = res.lastComment;
    }

    if (err) {
      that.commentError('Sorry there was an error');
    }

  });
};


BillController.prototype.postComment = function() {
  var that = this;
  if (!that.validationHandler()) {
    return;
  }

  if (!this.billService || !this.billService.postComment) {
    return;
  }

  var scriptExp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  var objectExp = /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi;

  if (scriptExp.test(this.commentBody) || objectExp.test(this.commentBody)) {
    this.commentError('Sorry, there was an error.');
    this.commentBody = '';
    return;
  }

  if (this.postingComment) {
    return;
  }

  this.postingComment = true;
  this.billService.postComment(this.id, this.commentBody, function(err, result) {
    that.postingComment = false;
    if (err) {
      that.postCommentError = true;
      if (err.message === 'Login Required') {
        that.location.path('/');
      }
    } else if (result) {
      that.commentMessage = false;
      that.commentBody = undefined;
      that.fetchComments();
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
  if (!this.body) {
    return;
  }
  if (this.body.billData.user_voted) {
    that.hasVoted = true;
  } else {
    that.hasVoted = false;
  }
};


BillController.prototype.userVote = function() {
  var that = this;
  if (!that.validationHandler()) {
    return;
  }

  this.showVoteModal = true;
};


BillController.prototype.sponsorCount = function(sponsors) {

  if (!sponsors) {
    return;
  }

  var cent = 0;
  var total = 0;

  for (var i = 0; i < Object.keys(sponsors).length; i++) {
    total += sponsors[Object.keys(sponsors)[i]];
  }

  cent = total / 100;

  this.body.billData.cosponsors_count.total = total;
  this.body.billData.cosponsors_count.democrat_per = sponsors.democrat / cent;
  this.body.billData.cosponsors_count.republican_per = sponsors.republican / cent;
  this.body.billData.cosponsors_count.independent_per = sponsors.independent / cent;

};


BillController.prototype.getRepresentation = function() {
  var that = this;

  if (!this.rs || !this.rs.user.district || !this.rs.user.state) {
    this.representation.setAvailable(false);
    return;
  }

  var request = {
    state: this.rs.user.state,
    district: this.rs.user.district,
    bill_id: this.body.billData.bill_id,
  };

  this.representation.setState(this.rs.user.state);
  this.representation.setDistrict(this.rs.user.district);
  this.representation.setBusy(true);

  this.billService.getRepresentation(request, function(err, res) {

    if (err) {
      that.representation.setAvailable(false);
      that.representation.setBusy(false);
    }

    if (res) {
      that.representation.populate(res);
    }

  });

};


BillController.prototype.calculatePie = function() {
  var noVote = {
    val: Math.round((this.noVote / (this.noVote + this.yesVote)) * 100),
    label: 'Against',
    className: 'against',
  };
  var yesVote = {
    val: Math.round((this.yesVote / (this.noVote + this.yesVote)) * 100),
    label: 'In Favor',
    className: 'favor',
  };
  this.nationalStats = [ noVote, yesVote ];
};

BillController.prototype.updateOverallStats = function(vote) {
  if (vote) {
    this.yesVote ++;
  } else {
    this.noVote ++;
  }
};

BillController.prototype.updateRepresentationView = function(vote) {
  this.updateOverallStats(vote);
  this.calculatePie();
  this.representation.updateVotePercent(vote);
  this.representation.updateRepresentation();
};

module.exports = BillController;
