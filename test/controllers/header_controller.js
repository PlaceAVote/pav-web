var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var HeaderCtrl;
var mockUserService = {
  getUserProfile: function() {},
};
var mockScope = {
  $watchCollection: function() {},
  $watch: function() {},
};
var mockTimeout = function(callback, time) {
  callback();
};
var mockSearch = {
  search: function(q, callback) {
    called = true;
    callback();
  }
};
describe('HeaderCtrl', function() {
  jsdom();
  before(function() {
    HeaderCtrl = require('../../src/controllers/header_controller.js');
  });
  it('search wont search unless query has changed', function() {
    var called = false;
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, {}, mockSearch, {});
    subject.cachedSearch = 'hello';
    subject.search('hello');
    expect(called).to.eql(false);
  });

  it('sets the cachedSearch of the header on if search is different to previous', function() {
    var called = false;
    var mockSearch = {
      search: function(q, callback) {
        called = true;
        callback(undefined, ['world']);
      }
    };
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, {}, mockSearch, {});
    subject.search('hello');
    expect(called).to.eql(true);
    expect(subject.cachedSearch).to.eql('hello');
    expect(subject.cachedResults).to.eql(['world']);
  });
});

describe('Notifications', function() {
  it('Should return if shoNotifications is false', function() {
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, {}, mockSearch, {});
    subject.showNotifications = false;
    subject.loadingScroll = false;
    subject.notificationCheck();
    expect(subject.loadingScroll).to.equal(false);
  });
  it('Should return if loading is true', function() {
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, {}, mockSearch, {});
    subject.showNotifications = true;
    subject.loadingScroll = true;
    subject.notificationCheck();
    expect(subject.loadingScroll).to.equal(true);
  });
  it('Should return if newTimestamp and loadLoaded is the same', function() {
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, {}, mockSearch, {});
    subject.newTimestamp = '1234';
    subject.lastLoaded = '1234';
    subject.showNotifications = true;
    subject.loadingScroll = null;
    subject.notificationCheck();
    expect(subject.newTimestamp).to.equal(subject.lastLoaded);
    expect(subject.loadingScroll).to.equal(null);
  });
  var mockNotification = {
    getNotifications: function(timeStamp, callback) {
      var results = {
        last_timestamp: '1235',
        results: [{type:'userissue'}, {type: 'commentreply'}],
      };
      return callback(undefined, results);
    }
  };
  it('Should return if notifications object on success', function() {
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, mockNotification, mockSearch, {});
    subject.newTimestamp = '1234';
    subject.showNotifications = true;
    subject.loadingScroll = false;
    subject.notificationCheck();
    expect(subject.newTimestamp).to.equal('1235');
    expect(subject.loadingScroll).to.equal(false);
    expect(subject.notifications).to.be.an.Array;
    expect(subject.notifications[0].type).to.equal('userissue');
    expect(subject.notifications[1].type).to.equal('commentreply');
  });  
    var mockNotificationLast = {
    getNotifications: function(timeStamp, callback) {
      var results = {
        last_timestamp: null,
        results: [{type:'userissue'}, {type: 'commentreply'}],
      };
      return callback(undefined, results);
    }
  };
  it('Should prevent from reloading when no more notifications available', function() {
    var subject = new HeaderCtrl({}, mockScope, {}, mockTimeout, {}, mockUserService, mockNotificationLast, mockSearch, {});
    subject.showNotifications = true;
    subject.newTimestamp = '21321';
    subject.loadingScroll = false;
    subject.last_timestamp = null;
    subject.lastLoaded = '213123';
    subject.notifications = [];
    subject.notificationCheck();
    expect(subject.loadingScroll).to.equal(false);
    expect(subject.notifications).to.be.an.Array;
    expect(subject.notifications[0].type).to.equal('userissue');
    expect(subject.notifications[1].type).to.equal('commentreply');
    expect(subject.newTimestamp).to.equal(null);
    expect(subject.lastLoaded).to.equal(null);
  });  
});
