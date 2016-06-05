/* jscs: disable */
var DEFAULT_MESSAGE = 'Placeavote needs your help! Please submit your opinions and suggestions to us so that we can keep making Placeavote better!';
/* jscs: enable */
var DEFAULT_LINK_MESSAGE = 'Fill out the Questionnaire';

function Feedback(options) {
  this.title = 'feedback';
  this.type = 'feedback';
  this.message = options.message || DEFAULT_MESSAGE;
  this.link = options.link;
  this.linkMessage = options.linkMessage || DEFAULT_LINK_MESSAGE;
}

module.exports = Feedback;
