var Bill = require("../../src/models/bill.js");
var expect = require("chai").expect;

describe("Bills", function(){
    it("Has Topic property", function(){
        var subject = new Bill({topic:"Guns"});
        expect(subject.topic).to.eql("Guns"); 
    });
    it("Has Name Property", function(){
        var subject = new Bill({name: "H.R. 1013: Regulate Marijuana Like Alcohol Act"});
        expect(subject.name).to.eql("H.R. 1013: Regulate Marijuana Like Alcohol Act");
    });
    it("Doesn't set options when undefined", function(){
        var subject = new Bill();
        expect(subject.name).to.eql(undefined);
    });
    it("Has Comments", function(){
        var options = {
                comments: [
                    {
                        user: "paul",
                        message: "cats are cool",
                        recievedAt: new Date()
                    }
                ]
        };
        var subject = new Bill(options);
        expect(subject.comments.length).to.eql(1);
        expect(subject.comments[0].user).to.eql("paul");
        expect(subject.comments[0].message).to.eql("cats are cool");
    });
    it("Has a Yes Vote", function(){
        var subject = new Bill({yesVote: 10});
        expect(subject.yesVote).to.eql(10);
    });
    it("Has a No Vote", function(){
        var subject = new Bill({noVote: 10});
        expect(subject.noVote).to.eql(10);
    });
    it("Majority Vote 'Yes'", function(){
        var subject = new Bill({yesVote: 75, noVote: 25});
        expect(subject.majorityVote()).to.eql({majority: 'yes', percent: 75});
    });
    it("Majority Vote 'No'", function(){
        var subject = new Bill({yesVote: 5, noVote: 10});
        expect(subject.majorityVote()).to.eql({majority: 'no', percent: 67});
    });
});
