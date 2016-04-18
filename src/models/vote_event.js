function VoteEvent(options) {
  options = options || {};
  this.bill_id = options.bill_id;
  this.vote = options.vote;
  this.vote_id = options['vote-id'];
  this.created_at = options.created_at;
  this.timestamp = options.timestamp;
  this.user_id = options.user_id;
  this.type = options.type;
  this.bill_title = options.bill_title;
  this.event_id = options.event_id;
  this.voter_first_name = options.voter_first_name;
  this.voter_last_name = options.voter_last_name;
  this.voter_id = options.voter_id;
  this.voter_img_url = options.voter_img_url || '//cdn.placeavote.com/img/profile/profile-picture.png';
  this.read = options.read;
}

module.exports = VoteEvent;
