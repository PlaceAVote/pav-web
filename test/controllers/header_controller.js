var expect = require('chai').expect;
var HeaderCtrl = require('../../src/controllers/header_controller.js');

describe('HeaderCtrl', function() {
  var mockUserService = {
    getUserProfile: function() {},
  };
  var mockScope = {
    $watchCollection: function() {},
  };
  var mockTimeout = function(callback, time) {
    callback();
  };
  it('search wont search unless query has changed', function() {
    var called = false;
    var mockSearch = {
      search: function(q, callback) {
        called = true;
        callback();
      }
    };
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
