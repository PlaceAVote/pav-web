var Bill = require("../../src/models/bill_summary.js");
var expect = require("chai").expect;

describe("Bills", function(){
  it("Has Topic property", function(){
    var subject = new Bill({subject:"Guns", votes:{}});
    expect(subject.subject).to.eql("Guns");
  });
  it("Has Name Property", function(){
    var subject = new Bill({votes:{},short_title: "H.R. 1013: Regulate Marijuana Like Alcohol Act"});
    expect(subject.short_title).to.eql("H.R. 1013: Regulate Marijuana Like Alcohol Act");
  });
  it("Doesn't set options when undefined", function(){
    var subject = new Bill();
    expect(subject.name).to.eql(undefined);
  });
  it("Has Comments", function(){
    var options = {comment_count: 80};
    var subject = new Bill({comment_count: 80});
    expect(subject.comment_count).to.eql(80);
  });
  it("Has a Yes Vote", function(){
    var subject = new Bill({"yes-count": 10});
    expect(subject.yesVote).to.eql(10);
  });
  it("Has a No Vote", function(){
    var subject = new Bill({"no-count":10});
    expect(subject.noVote).to.eql(10);
  });
  it("Majority Vote 'Yes'", function(){
    var subject = new Bill({'yes-count': 75, 'no-count': 25});
    expect(subject.majorityVote()).to.eql({majority: 'Yes', percent: 75});
  });
  it("Majority Vote 'No'", function(){
    var subject = new Bill({'yes-count': 5, 'no-count': 10});
    expect(subject.majorityVote()).to.eql({majority: 'No', percent: 67});
  });
  it('goes to bill page for specific bill', function() {
    var options = { comment_count: 10, bill_id: 1000};
    var subject = new Bill(options);
    var location = {
      path : function (pathToGoTo) {
        expect(pathToGoTo).to.eql('bill/1000');
      }
    };
    subject.goToPage(location);
    });
});
