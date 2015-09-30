var Bill = require("../../src/models/bill.js");
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
        var options = {votes:{}, total_comments: 80};
        var subject = new Bill(options);
        expect(subject.total_comments).to.eql(80);
    });
    it("Has a Yes Vote", function(){
        var subject = new Bill({votes: {yes: 10}});
        expect(subject.yesVote).to.eql(10);
    });
    it("Has a No Vote", function(){
        var subject = new Bill({votes: {no:10}});
        expect(subject.noVote).to.eql(10);
    });
    it("Majority Vote 'Yes'", function(){
        var subject = new Bill({votes:{yes: 75, no: 25}});
        expect(subject.majorityVote()).to.eql({majority: 'Yes', percent: 75});
    });
    it("Majority Vote 'No'", function(){
        var subject = new Bill({votes:{yes: 5, no: 10}});
        expect(subject.majorityVote()).to.eql({majority: 'No', percent: 67});
    });
});
