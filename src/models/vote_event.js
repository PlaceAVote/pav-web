function VoteEvent(options) {
  var options = options || {};
  this.bill_id = options.bill_id;
  this.vote = options.vote;
  this.vote_id = options['vote-id'];
  this.created_at = options.created_at;
  this.timestamp = options.timestamp;
  this.user_id = options.user_id;
  this.type = options.type;
  this.bill_title = options.bill_title;
}

module.exports = VoteEvent;
