var expect = require('chai').expect;
var fixtures = require('../fixtures/legislator.js');
var LegislatorService = require('../../src/services/legislator_service.js');
var Lesgilator = require('../../src/models/legislator.js');

function mockAuth(){
  var getAccessToken = function(){
    return 'token';
  };
  return {
    getAccessToken: getAccessToken,
  };
}
var auth = new mockAuth();

describe('Legislator', function(){
  it('returns error if id is not provided', function(){
     var subject = new LegislatorService();
     subject.getById(undefined, function(err, result){
      expect(err).to.eql({message: 'ID Not Provided'});
     });
  });
  it('calls resource with correct params', function(done){
    function mockResource(url, param, method){
      expect(url).to.eql('http://pav-congress-api-196217309.us-west-2.elb.amazonaws.com:8080/legislators/100');
      expect(param).to.eql('100');
      expect(method.getById.headers['PAV_AUTH_TOKEN']).to.eql('token');
      done();
    }
    mockResource.prototype.getById = function(object, onLoad, onError){
     onError('Server Error');
    };
    var subject = new LegislatorService(mockResource, auth);
    subject.getById('100', function(err, result){
    });
  });
  it('calls callback with error when server returns error', function(done){
    function mockResource(url, param, method){
    }
    mockResource.prototype.getById = function(object, onLoad, onError){
     onError('Server Error');
    };
    var subject = new LegislatorService(mockResource, auth);
    subject.getById('100', function(err, result){
      expect(err).to.eql('Server Error');
      done();
    });
  });
  it('returns legislator data from server', function(done){
    function mockResource(url, param, method){
    }
    mockResource.prototype.getById = function(object, onLoad, onError){
     onLoad('Server Error');
    };
    var subject = new LegislatorService(mockResource, auth);
    subject.getById('100', function(err, result){
      expect(err).to.eql(undefined);
      expect(result).to.be.instanceOf(Lesgilator);
      done();
    });
  });
});
