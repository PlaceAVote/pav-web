var expect = require('chai').expect;
var TimelineResponseFactory = require('../../src/factories/timeline_response_factory.js');
var Comment = require('../../src/models/comment.js');

describe('Single Response', function(){
    it('throws error if no type is defined', function(){
      var fn = function() {
        var result = TimelineResponseFactory.getResponse();
      }
      expect(fn).to.throw({message:'No Type Defined'});
    });
    it('returns a comment for comment type', function(){
      var result = TimelineResponseFactory.getResponse({type: 'comment'});
      expect(result).to.be.an.instanceof(Comment);
    });
    it('throws error when default', function(){
      var fn = function() {
        var result = TimelineResponseFactory.getResponse({type: 'cat'});
      }
      expect(fn).to.throw({message:'Type Not Supported'});
    });
});
describe('Multiple Responses', function() {
  it('returns an array of the same length', function(){
    var responses = [{type: 'comment'}, {type: 'comment'}, {type: 'comment'}]
    var results = TimelineResponseFactory.getResponses(responses);
    expect(results.length).to.eql(3);
  });
});

