var expect = require("chai").expect;
var Comment = require("../../src/models/comment.js");
var comment =  {
  "author": "tony@pl.com",
  "bill_id": "hr2-114",
  "body": "comment 2 here",
  "has_children": true,
  "id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
  "parent_id": null,
  "replies": [
    {
      "author": "tony@pl.com",
      "bill_id": "hr2-114",
      "body": "Reply to comment 2",
      "has_children": false,
      "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
      "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
      "replies": [],
      "score": "2",
      "timestamp": "1444764060968",
    },
  ],
  "score": 100,
  "scored": false,
  "timestamp": 1444764009809,
};
describe("comment model", function(){
  it("comment to have a author property", function(){
    var options = {
      author: "Paul Barber"
    };
    var subject = new Comment(options);
    expect(subject.author).to.eql("Paul Barber");
  });
  it("comment to have a body property", function(){
    var options = {
      body: "To ammend the act so it makes sense"
    };
    var subject = new Comment(options);
    expect(subject.body).to.eql("To ammend the act so it makes sense");
  });
  it("comment to have a has_children property", function(){
    var options = {
      has_children: true
    };
    var subject = new Comment(options);
    expect(subject.has_children).to.eql(true);
  });
  it("comment to have a subject property", function(){
    var options = {
      bill_id: "Some Bill"
    };
    var subject = new Comment(options);
    expect(subject.bill_id).to.eql("Some Bill");
  });
  it("comment to have a upvotes property", function(){
    var options = {
      score: 3
    };
    var subject = new Comment(options);
    expect(subject.score).to.eql(3);
  });
  it("comment to have a timestamp property", function(){
    var options = {
      timestamp: 1444764009809
    };
    var subject = new Comment(options);
    expect(subject.timestamp).to.eql(1444764009809);
  });
  it("comment to have a id property", function(){
    var options = {
      id: 1444764009809
    };
    var subject = new Comment(options);
    expect(subject.id).to.eql(1444764009809);
  });
  it("comment to have a parent id property", function(){
    var options = {
      parent_id: 1444764009809
    };
    var subject = new Comment(options);
    expect(subject.parent_id).to.eql(1444764009809);
  });
  it("buildChildren recursively builds children", function(){
    var child = {
      "author": "tony@pl.com",
      "bill_id": "hr2-114",
      "body": "Reply to comment 2",
      "has_children": true,
      "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
      "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
      "replies": [
        {
          "author": "tony@pl.com",
          "bill_id": "gun-crime-1",
          "body": "Reply to comment 2",
          "has_children": false,
          "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
          "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
          "replies": [],
          "score": "2",
          "timestamp": "1444764060968",
        }
      ],
      "score": "2",
      "timestamp": "1444764060968",
    }
    var subject = new Comment(child);
    Comment.buildChildren(subject);
    expect(subject.replies[0].bill_id).to.eql('gun-crime-1');
    expect(subject.replies[0].replies.length).to.eql(0);
  });
  it("buildChildren recursively builds children", function(){
    var comment = {
      "author": "tony@pl.com",
      "bill_id": "hr2-114",
      "body": "Reply to comment 2",
      "has_children": true,
      "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
      "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
      "replies": [
        {
          "author": "tony@pl.com",
          "bill_id": "gun-crime-1",
          "body": "Reply to comment 2",
          "has_children": false,
          "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
          "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
          "replies": [],
          "score": "2",
          "timestamp": "1444764060968",
        }
      ],
      "score": "2",
      "timestamp": "1444764060968",
    };
    var subject = new Comment(comment);
    Comment.buildChildren(subject);
    expect(subject.replies[0].bill_id).to.eql('gun-crime-1');
    expect(subject.replies[0].replies.length).to.eql(0);
  });
  it("builds children with depth counter", function(){
    var comment = {
      "author": "tony@pl.com",
      "bill_id": "hr2-114",
      "body": "Reply to comment 2",
      "has_children": true,
      "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
      "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
      "replies": [
        {
          "author": "tony@pl.com",
          "bill_id": "gun-crime-1",
          "body": "Reply to comment 2",
          "has_children": true,
          "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
          "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
          "replies": [
            {
              "author": "tony@pl.com",
              "bill_id": "gun-crime-1",
              "body": "Reply to comment 2",
              "has_children": false,
              "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
              "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
              "replies": [],
              "score": "2",
              "timestamp": "1444764060968",
            }
          ],
          "score": "2",
          "timestamp": "1444764060968",
        },
        {
            "author": "tony@pl.com",
            "bill_id": "gun-crime-1",
            "body": "Reply to comment 2",
            "has_children": false,
            "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
            "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
            "replies": [],
            "score": "2",
            "timestamp": "1444764060968",
        }
      ],
      "score": "2",
      "timestamp": "1444764060968",
    };
    var subject = new Comment(comment);
    Comment.buildChildren(subject);
    expect(subject.deep).to.eql(0);
    expect(subject.replies.length).to.eql(2);
    expect(subject.replies[0].bill_id).to.eql('gun-crime-1');
    expect(subject.replies[0].deep).to.eql(1);
    expect(subject.replies[1].deep).to.eql(1);
    expect(subject.replies[0].replies.length).to.eql(1);
    expect(subject.replies[0].replies[0].deep).to.eql(2);
  });
  describe('Reply', function() {
    it('sets error replyFailed to true is reply fails', function() {
      var comment = {
        "author": "tony@pl.com",
        "bill_id": "hr2-114",
        "body": "Reply to comment 2",
        "has_children": true,
        "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
        "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
        "replies": [
          {
            "author": "tony@pl.com",
            "bill_id": "gun-crime-1",
            "body": "Reply to comment 2",
            "has_children": false,
            "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
            "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
            "replies": [],
            "score": "2",
            "timestamp": "1444764060968",
          }
        ],
        "score": "2",
        "timestamp": "1444764060968",
      };
      var subject = new Comment(comment);
      var service = {
        reply: function(comment, billId, parentId, callback) {
           callback('Bill ID Not Defined');
        },
      };
      subject.reply(undefined, service);
      expect(subject.replyFailed).to.eql(true);
    });
    it('adds reply to replies list when comment is added', function() {
      var comment = {
        "author": "tony@pl.com",
        "bill_id": "hr2-114",
        "body": "Reply to comment 2",
        "has_children": true,
        "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
        "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
        "replies": [
          {
            "author": "tony@pl.com",
            "bill_id": "gun-crime-1",
            "body": "Reply to comment 2",
            "has_children": false,
            "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
            "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
            "replies": [],
            "score": "2",
            "timestamp": "1444764060968",
          }
        ],
        "score": "2",
        "timestamp": "1444764060968",
      };
      var subject = new Comment(comment);
      var service = {
        reply: function(c, billId, parentId, callback) {
           callback(undefined, new Comment(comment));
        },
      };
      subject.reply(undefined, service);
      expect(subject.replyFailed).to.eql(undefined);
      expect(subject.replies.length).to.eql(1);
      expect(subject.replies[0].bill_id).to.eql('hr2-114');
    });
  });
  describe('Like', function() {
    it('Sets LikeError to true if service returns error', function(done) {
      var subject = new Comment(comment);
      var service = {
        like: function(object, billId, callback) {
           expect(billId).to.eql('hr2-114');
           expect(object).to.eql('comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626');
           return callback('Error');
        },
      };
      subject.like(service);
      expect(subject.likeFailed).to.eql(true);
      done();
    });
    it('Sets Liked to true if service returns error', function() {
      var subject = new Comment(comment);
      var service = {
        like: function(object, billId, callback) {
           expect(object).to.eql('comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626');
           return callback(undefined, true);
        },
      };
      subject.like(service);
      expect(subject.liked).to.eql(true);
    });
  });
  describe('Dislike', function() {
    it('Sets DisLikeError to true if service returns error', function(done) {
      var subject = new Comment(comment);
      var service = {
        dislike: function(object, billId ,callback) {
           expect(object).to.eql('comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626');
           return callback('Error');
        },
      };
      subject.dislike(service);
      expect(subject.dislikeFailed).to.eql(true);
      done();
    });
    it('Sets Disliked to true if service returns error', function() {
      var subject = new Comment(comment);
      var service = {
        dislike: function(object, billId, callback) {
           expect(object).to.eql('comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626');
           return callback(undefined, true);
        },
      };
      subject.dislike(service);
      expect(subject.disliked).to.eql(true);
    });
    it('only calls service if user has already voted', function() {
      serviceCalled = false;
      comment.scoring = true;
      var subject = new Comment(comment);
      var service = {
        dislike: function(object, billId, callback) {
           serviceCalled = true;
           return callback(undefined, true);
        },
        like: function(object, billId, callback) {
           serviceCalled = true;
           return callback(undefined, true);
        },
        revoke: function(object, billId, kind, callback) {
          serviceCalled = true;
          return callback(undefined, true);
        }
      };
      subject.dislike(service);
      subject.like(service);
      expect(serviceCalled).to.eql(true);
    });

    it('should return error if comment contains script tag', function() {
      var mockTimeout = function() {return;};
      var subject = new Comment();
      subject.replyText = '<script></script>';
      subject.reply(undefined,undefined, mockTimeout);
      expect(subject.replyText).to.equal('');
    });
  });
});
