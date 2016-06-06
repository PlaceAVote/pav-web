var strftime = require('strftime');

function SettingsItem() {

}

SettingsItem.prototype.createStringFromUTCString = function(utcInMiliString) {
  dobNum = parseInt(utcInMiliString);
  if (isNaN(dobNum)) {
    this.dob = null;
  } else {
    this.dob = new Date(dobNum);
  }
};

SettingsItem.createFromJson = function(json) {
  json = json || {};
  var settingsItem = new SettingsItem();
  settingsItem.email = json.email;
  settingsItem.first_name = json.first_name;
  settingsItem.last_name = json.last_name;
  settingsItem.createStringFromUTCString(json.dob);
  settingsItem.gender = json.gender;
  settingsItem.city = json.city;
  settingsItem.img_url = json.img_url || '//cdn.placeavote.com/img/profile/profile-picture.png';
  settingsItem.user_id = json.user_id;
  settingsItem.social_login = json.social_login;
  settingsItem.public = json.public;
  return settingsItem;
};

SettingsItem.prototype.toBody = function() {
  var body = {
    email: this.email,
    first_name: this.first_name,
    last_name: this.last_name,
    gender: this.gender,
    public: this.public,
    city: this.city,
  };

  if (this.dob) {
    body.dob = this.dob.getTime().toString();
  }
  return body;
};

module.exports = SettingsItem;
