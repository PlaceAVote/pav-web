var expect = require('chai').expect;
var SettingsController = require('../../src/controllers/settings_controller.js');

describe('Settings Controller', function() {
  var mockScope = {};
  var mockLocation = {};
  var mockTimeout = setTimeout;
  var mockUserService = {
    getUserSettings: function(callback) {
      callback(null, {});
    },
  };
  var mockAuthService = {
    validateToken: function() {}
  };
  var mockRootScope = {};
  var mockAnchorScroll = {};
  describe('Initialise', function() {
    it('should have initial values', function(done) {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      expect(subject.current_password).to.eql('');
      expect(subject.new_password).to.eql('');
      expect(subject.autosaved).to.eql({
        city: false,
        gender: false,
        dob:false,
        email: false,
        public: false,
      });
      expect(subject.showSettings).to.eql(true);
      expect(subject.profilePicture.saving).to.eql(true);
      expect(subject.gender_options.length).to.eql(3);
      expect(subject.gender_options[0]).to.eql({name: 'His', des: 'male'});
      expect(subject.gender_options[1]).to.eql({name: 'Her', des: 'female'});
      expect(subject.gender_options[2]).to.eql({name: 'They', des: 'they'});
      done();
    });

    it('will initialise a settings Item when one is returned from the service', function(done) {
      var mockUserService = {
        getUserSettings: function(callback) {
          var expected = {
            email: 'test@settings.com',
            first_name: 'John',
            last_name: 'Locke',
            gender: 'male',
            dob: '662083200000',
            public: false,
            city: 'The Island'
          };
          callback(null, expected);
        },
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      expect(subject.settingsItem.email).to.eql('test@settings.com');
      expect(subject.settingsItem.first_name).to.eql('John');
      expect(subject.settingsItem.last_name).to.eql('Locke');
      expect(subject.settingsItem.gender).to.eql('male');
      expect(subject.settingsItem.dob).to.eql(new Date(662083200000));
      expect(subject.settingsItem.public).to.eql(false);
      expect(subject.settingsItem.city).to.eql('The Island');
      expect(subject.settingsItem).to.eql(subject.previousValues);
      done();
    });

    it('will initialise a settings Item when an empty response object is returned', function(done) {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      expect(subject.settingsItem.email).to.eql(undefined);
      expect(subject.settingsItem.first_name).to.eql(undefined);
      expect(subject.settingsItem.last_name).to.eql(undefined);
      expect(subject.settingsItem.gender).to.eql(undefined);
      expect(subject.settingsItem.public).to.eql(undefined);
      expect(subject.settingsItem.city).to.eql(undefined);
      done();
    });

    it('will initialise a settings Item when an nothing is returned from the service', function(done) {
      var mockUserService = {
        getUserSettings: function(callback) {
          return callback(null, null);
        },
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      expect(subject.settingsItem.email).to.eql(undefined);
      expect(subject.settingsItem.first_name).to.eql(undefined);
      expect(subject.settingsItem.last_name).to.eql(undefined);
      expect(subject.settingsItem.gender).to.eql(undefined);
      expect(subject.settingsItem.public).to.eql(undefined);
      expect(subject.settingsItem.city).to.eql(undefined);
      done();
    });

    it('will initialise a settings Item when an nothing an error is returned from the service', function(done) {
      var mockUserService = {
        getUserSettings: function(callback) {
          return callback(new Error('Service not available'), null);
        },
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      expect(subject.settingsItem.email).to.eql(undefined);
      expect(subject.settingsItem.first_name).to.eql(undefined);
      expect(subject.settingsItem.last_name).to.eql(undefined);
      expect(subject.settingsItem.gender).to.eql(undefined);
      expect(subject.settingsItem.public).to.eql(undefined);
      expect(subject.settingsItem.city).to.eql(undefined);
      done();
    });
  });
  describe('AutoSave', function() {
    it('does not call save user settings if item is an empty city and the settingsItem of the subject is also empty', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      var called = false;
      subject.saveUserSettings = function() {
        called = true;
      }
      subject.settingsItem.city = '';
      subject.autoSave('city');
      expect(called).to.eql(false);
    });
    it('does not call save user settings if item is an empty city and the settingsItem of the subject is null', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      var called = false;
      subject.saveUserSettings = function() {
        called = true;
      }
      subject.settingsItem.city = null;
      subject.autoSave('city');
      expect(called).to.eql(false);
    });
    it('does not call save user settings if item is an empty email and the settingsItem of the subject is also empty', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      var called = false;
      subject.saveUserSettings = function() {
        called = true;
      }
      subject.settingsItem.email = '';
      subject.autoSave('email');
      expect(called).to.eql(false);
    });
    it('does not call save user settings if item is an empty email and the settingsItem of the subject is null', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);

      var called = false;
      subject.saveUserSettings = function() {
        called = true;
      }
      subject.settingsItem.city = null;
      subject.autoSave('email');
      expect(called).to.eql(false);
    });
    it('should set autosaved properties to true is saved', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      var called = false;
      subject.saveUserSettings = function(cb) {
        called = true;
        cb();
      }
      expect(subject.autosaved.gender).to.eql(false);
      subject.autoSave('gender');
      expect(called).to.eql(true);
      // Shows only relevant fields are altered
      expect(subject.autosaved).to.eql({
        city: false,
        gender: true,
        dob:false,
        email: false,
        public: false,
      });
      subject.autoSave('dob');
      expect(subject.autosaved.dob).to.eql(true);
      subject.settingsItem.email = 'cat@tester.com';
      subject.autoSave('email');
      expect(subject.autosaved.email).to.eql(true);
      subject.autoSave('public');
      expect(subject.autosaved.public).to.eql(true);
    });
    it('should call eraseAutoSave after timeout', function(done) {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      var called = false;
      subject.saveUserSettings = function(cb) {
        cb();
      }
      subject.eraseAutoSave = function() {
        called = true;
      }
      subject.autoSave('gender');
      setTimeout(function() {
        expect(called).to.eql(true);
        done();
      }, 1100);
    });
    it('does not continue is saveUserSettings records error', function(done) {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      var called = false;
      subject.saveUserSettings = function(cb) {
        cb(new Error('Error'));
      }
      subject.autoSave('gender')
      subject.eraseAutoSave = function() {
        called = true;
      }
      setTimeout(function() {
        expect(called).to.eql(false);
        done();
      }, 1100);
    });
  });
  describe('eraseAutoSave', function() {
    it('sets autosaved properties to false', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.autosaved = {
        city: true,
        gender: true,
        dob:true,
        email: true,
        public: true,
      };
      subject.eraseAutoSave('gender');
      // Shows only relevant fields are altered
      expect(subject.autosaved).to.eql({
        city: true,
        gender: false,
        dob:true,
        email: true,
        public: true,
      });
      subject.eraseAutoSave('dob');
      expect(subject.autosaved.dob).to.eql(false);
      subject.eraseAutoSave('email');
      expect(subject.autosaved.email).to.eql(false);
      subject.eraseAutoSave('public');
      expect(subject.autosaved.public).to.eql(false);
    });
  });
  describe('Save User Settings', function() {
    it('set error state on subject and pass error through', function(done) {
      var mockUserService = {
        getUserSettings: function(cb) { cb() },
        saveUserSettings: function(params, cb) {
          return cb(new Error('Service Error'));
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.saveUserSettings(function(err) {
        expect(subject.saving).to.eql(false);
        expect(subject.error.message).to.eql('Service Error');
        expect(err).to.eql(subject.error);
        done();
      });
    });
    it('set save state on subject', function(done) {
      var mockUserService = {
        getUserSettings: function(cb) { cb() },
        saveUserSettings: function(params, cb) {
          return cb(null);
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.saveUserSettings(function(err) {
        expect(subject.saveConfirmed).to.eql(true);
        expect(subject.saving).to.eql(false);
        expect(err).to.eql(null);
        setTimeout(function() {
          expect(subject.saveConfirmed).to.eql = false;
          done();
        }, 1850);
      });
    });
    it('should only call user settings save with diffed field', function(done) {
      var user = {
        email: 'test@settings.com',
        first_name: 'John',
        last_name: 'Locke',
        gender: 'male',
        dob: '662083200000',
        public: false,
        city: 'The Island'
      };
      var actualParams;
      var mockUserService = {
        getUserSettings: function(cb) { cb(null, user) },
        saveUserSettings: function(params, cb) {
          actualParams = params;
          return cb(null);
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      // update first and last name
      subject.settingsItem.first_name = 'Jeremy';
      subject.settingsItem.last_name = 'Bentham';
      // should not include empty properties
      subject.settingsItem.zipcode = '';
      subject.saveUserSettings(function(err) {
        expect(actualParams.first_name).to.eql('Jeremy');
        expect(actualParams.last_name).to.eql('Bentham');
        expect(actualParams.dob).to.eql(undefined);
        expect(actualParams.zipcode).to.eql(undefined);
        expect(err).to.eql(null);
        done();
      });
    });
  });
  describe('Change Password', function() {
    it('set error state on subject and return', function() {
      var actualParams;
      var mockUserService = {
        getUserSettings: function(cb) { cb() },
        changePassword: function(params, cb) {
          actualParams = params;
          return cb(new Error('Service Error'));
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.current_password = 'test';
      subject.new_password = 'TEST';
      subject.changePassword();
      expect(actualParams.current_password).to.eql('test');
      expect(actualParams.new_password).to.eql('TEST');
      expect(subject.passwordError).to.eql(true);
      expect(subject.savingPassword).to.eql(false);
      expect(subject.newPassword).to.eql(undefined);
      expect(subject.current_password).to.eql('');
      expect(subject.new_password).to.eql('');
    });
    it('set save state state on subject and return', function(done) {
      var mockUserService = {
        getUserSettings: function(cb) { cb() },
        changePassword: function(params, cb) {
          return cb(null);
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.current_password = 'test';
      subject.new_password = 'TEST';
      subject.changePassword();
      expect(subject.passwordError).to.eql(false);
      expect(subject.savingPassword).to.eql(false);
      expect(subject.newPassword).to.eql(true);
      expect(subject.current_password).to.eql('');
      expect(subject.new_password).to.eql('');
      setTimeout(function() {
        expect(subject.newPassword).to.eql(false);
        done();
      }, 1850);
    });
  });
  describe('Has Cropped', function() {
    it('changes cropped to true', function() {
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.hasCropped();
      expect(subject.profilePicture.cropped).to.eql(true);
    });
  });
  describe('save Profile Picture', function() {
    it('sets error state on error', function() {
      var mockUserService = {
        getUserSettings: function(cb) { cb() },
        profilePicture: function(params, cb) {
          return cb(new Error('Service Error'));
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.saveProfilePicture({img: 'test'});
      expect(subject.profilePicture.error).to.eql(true);
      expect(subject.profilePicture.saving).to.eql(true);
      expect(subject.profilePicture.success).to.eql(undefined);
    });

    it('sets saved state on result', function() {
      var mockRootScope = {
        user: {},
      };
      var mockUserService = {
        getUserSettings: function(cb) { cb() },
        profilePicture: function(params, cb) {
          return cb(null, { img_url: 'Its working!' });
        }
      };
      var subject = new SettingsController(mockScope, mockLocation, mockTimeout, mockUserService, mockAuthService, mockRootScope, mockAnchorScroll);
      subject.saveProfilePicture({img: 'test'});
      expect(subject.profilePicture.error).to.eql(undefined);
      expect(subject.profilePicture.saving).to.eql(true);
      expect(subject.profilePicture.success).to.eql(true);
      expect(subject.settingsItem.img_url).to.eql('Its working!');
      expect(subject.rs.user.img_url).to.eql('Its working!');
    });
  });
});
