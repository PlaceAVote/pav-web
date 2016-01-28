var Issue = require("../../src/models/issue.js");
var expect = require("chai").expect;

describe("Issues", function(){
  it("Issue to have a issue id property", function() {
    var options = {
      issue_id: "0001"
    };
    var subject = new Issue(options);
    expect(subject.issue_id).to.eql("0001");
  });

  it("Issue to have a bill id property", function() {
      var options = {
        bill_id: "hr2-114"
      };
      var subject = new Issue(options);
      expect(subject.bill_id).to.eql("hr2-114");
    });

  it("Issue to have comment property", function() {
    var options = {
      comment: "Comment Body goes here"
    };
    var subject = new Issue(options);
    expect(subject.comment).to.eql("Comment Body goes here");
  });

  it("Issue to have article link property", function() {
    var options = {
      article_link: "http://medium.com/somethinginteresting"
    };
    var subject = new Issue(options);
    expect(subject.article_link).to.eql("http://medium.com/somethinginteresting");
  });

  it("Issue to have article title property", function() {
    var options = {
      article_title: "interesting Article"
    };
    var subject = new Issue(options);
    expect(subject.article_title).to.eql("interesting Article");
  });

  it("Issue to have article image property", function() {
    var options = {
      article_img: "http://medium.com/img/101"
    };
    var subject = new Issue(options);
    expect(subject.article_img).to.eql("http://medium.com/img/101");
  });

  it("Issue to have timestamp property", function() {
    var options = {
      timestamp: "123213213"
    };
    var subject = new Issue(options);
    expect(subject.timestamp).to.eql("123213213");
  });

  it("Issue to have author id property", function() {
    var options = {
      author_id: "002"
    };
    var subject = new Issue(options);
    expect(subject.author_id).to.eql("002");
  });

  it("Issue to have author first name property", function() {
    var options = {
      author_first_name: "bob"
    };
    var subject = new Issue(options);
    expect(subject.author_first_name).to.eql("bob");
  });

  it("Issue to have author last name property", function() {
    var options = {
      author_last_name: "pop"
    };
    var subject = new Issue(options);
    expect(subject.author_last_name).to.eql("pop");
  });

  it("Issue to have article image url property", function() {
    var options = {
      author_img_url: "http://img.com"
    };
    var subject = new Issue(options);
    expect(subject.author_img_url).to.eql("http://img.com");
  });

  it("Issue to have default article image url if not provided", function() {
    var options = {};
    var subject = new Issue(options);
    expect(subject.author_img_url).to.eql("//cdn.placeavote.com/img/profile/profile-picture.png");
  });
});
