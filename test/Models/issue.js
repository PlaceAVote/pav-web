var Issue = require("../../src/models/issue.js");
var expect = require("chai").expect;

describe("Issues", function(){
  it("Given a collection of properties, Then construct an Issues object" , function() {
    var options = {
      issue_id: "0001",
      bill_id: "hr2-114",
      comment: "Comment Body goes here",
      article_link: "http://medium.com/somethinginteresting",
      article_title: "interesting Article",
      article_img: "http://medium.com/img/101",
      timestamp: "123213213",
      author_id: "002",
      first_name: "bob",
      last_name: "pop",
      img_url: "http://img.com",
      bill_title: "HR2 is awesome",
      emotional_response: 1
    };
    var subject = new Issue(options);
    expect(subject.issue_id).to.eql("0001");
    expect(subject.bill_id).to.eql("hr2-114");
    expect(subject.bill_title).to.eql("HR2 is awesome");
    expect(subject.comment).to.eql("Comment Body goes here");
    expect(subject.article_link).to.eql("http://medium.com/somethinginteresting");
    expect(subject.article_title).to.eql("interesting Article");
    expect(subject.article_img).to.eql("http://medium.com/img/101");
    expect(subject.timestamp).to.eql("123213213");
    expect(subject.author_id).to.eql("002");
    expect(subject.author_first_name).to.eql("bob");
    expect(subject.author_last_name).to.eql("pop");
    expect(subject.author_img_url).to.eql("http://img.com");
    expect(subject.emotional_response).to.eql(1);
  });

  it("Issue to have default article image url if not provided", function() {
    var options = {comment: "Comment Body goes here"};
    var subject = new Issue(options);
    expect(subject.author_img_url).to.eql("//cdn.placeavote.com/img/profile/profile-picture.png");
  });
});
