var util = require('util');

function Banner(user) {
  if (!user) {
    throw 'Banner needs user';
  }
  this.welcome = this.generateWelcome(user);
  this.message = 'Welcome to Placeavote. This is your feed page, the hive of activity for your political interests.';
  this.privacyMessage = this.generatePrivacyMessage(user);
  this.show = true;
}

Banner.prototype.generateWelcome = function(user) {
  return util.format('Hi %s,', user.first_name);
};

Banner.prototype.hide = function() {
  this.show = false;
};

Banner.prototype.generatePrivacyMessage = function(user) {
  var privacy = user.private ? 'public' : 'private';
  return util.format('You have chosen to make your profile %s', privacy);
};

module.exports = Banner;
