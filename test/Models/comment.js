var expect = require("chai").expect;
var Comment = require("../../src/models/comment.js");

describe("comment model", function(){
  it("comment to have a user_name property", function(){
    var options = {
      user_name: "Paul Barber"
    };
    var subject = new Comment(options);
    expect(subject.user_name).to.eql("Paul Barber");
  });
  it("comment to have a comment property", function(){
    var options = {
      comment: "To ammend the act so it makes sense"
    };
    var subject = new Comment(options);
    expect(subject.comment).to.eql("To ammend the act so it makes sense");
  });
  it("comment to have a replies property", function(){
    var options = {
      replies: 5
    };
    var subject = new Comment(options);
    expect(subject.replies).to.eql(5);
  });
  it("comment to have a subject property", function(){
    var options = {
      subject: "Some Bill"
    };
    var subject = new Comment(options);
    expect(subject.subject).to.eql("Some Bill");
  });
  it("comment to have a upvotes property", function(){
    var options = {
      upvotes: 3
    };
    var subject = new Comment(options);
    expect(subject.upvotes).to.eql(3);
  });
});
