var SettingsItem = require('../../src/models/settings_item.js');
var expect = require('chai').expect;

describe('SettingsItem', function(){
  describe('toBody', function() {
    it('toBody returns an object with string type dob', function(){
      var settingsItem = new SettingsItem();
      settingsItem.email = 'stefan@test.com';
      settingsItem.first_name = 'stefan';
      settingsItem.last_name = 'huber';
      settingsItem.dob = new Date(662083200000);
      settingsItem.gender = 'male';
      settingsItem.city = 'Berlin';
      settingsItem.img_url = 'image.com';
      settingsItem.public = false;
      settingsItem.social_login = true;
      var subject = settingsItem.toBody();
      var expected = {
        email: 'stefan@test.com',
        first_name: 'stefan',
        last_name: 'huber',
        gender: 'male',
        dob: 662083200000,
        public: false,
        city: 'Berlin'
      };
      expect(subject).to.eql(expected);
    });
  });
  describe('creatFromJson', function() {
    it('returns a settingsItem from a json object', function() {
      var expectedValues = {
        email: 'test@test.com',
        first_name: 'john',
        last_name: 'locke',
        gender: 'male',
        dob: 662083200000,
        public: false,
        city: 'Berlin',
      };
      var subject = SettingsItem.createFromJson(expectedValues);
      expect(subject.email).to.eql('test@test.com');
      expect(subject.first_name).to.eql('john');
      expect(subject.last_name).to.eql('locke');
      expect(subject.gender).to.eql('male');
      expect(subject.city).to.eql('Berlin');
      expect(subject.public).to.eql(false);
      expect(subject.dob).to.be.an.instanceof(Date);
      expect(subject.dob.getDay()).to.eql(2);
      expect(subject.dob.getMonth()).to.eql(11);
      expect(subject.dob.getYear()).to.eql(90);
    });
  });
});
