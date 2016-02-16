var expect = require('chai').expect;
var QuestionService = require('../../src/services/question_service.js');

describe('Question Service', function() {
  describe('getQuestions', function() {
    it('requires a token to get questions', function(done) {
      var mockAuthService = {
        getAccessToken: function() {
          return;
        },
      };
      var subject = new QuestionService({}, mockAuthService);
      subject.getQuestions(function(err, result) {
        expect(err).to.eql('No token present in question request');
        done();
      });
    });

    it('requires both resource and authService', function(done) {
      var mockAuthService = {
        getAccessToken: function() {
          return;
        },
      };
      var subject = new QuestionService(undefined, undefined);
      subject.getQuestions(function(err, result) {
        expect(err).to.eql('Resource and AuthService must be defined');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      var mockAuthService = {
        getAccessToken: function() {
          return 'token';
        },
      };
      function mockResource(url, params, method) {
        this.getQuestions = function(){};
        expect(url).to.contain('/user/questions');
        expect(params).to.eql(undefined);
        expect(method.getQuestions.headers.Authorization).to.eql('token');
        done();
      }
      var subject = new QuestionService(mockResource, mockAuthService);
      subject.getQuestions(function(err, result) {
        expect(err).to.eql(undefined);
      });
    });

    it('returns an error from the server', function(done) {
      var mockAuthService = {
        getAccessToken: function() {
          return 'token';
        },
      };
      function mockResource(url, params, method) {
        this.getQuestions = function(body, onLoad, onError) {
          expect(body).to.eql(undefined);
          return onError('Error');
        };
      }
      var subject = new QuestionService(mockResource, mockAuthService);
      subject.getQuestions(function(err, result) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('Calls QuestionFactory to return response', function(done) {
      var mockAuthService = {
        getAccessToken: function() {
          return 'token';
        },
      };
      function mockResource(url, params, method) {
        this.getQuestions = function(body, onLoad, onError) {
          expect(body).to.eql(undefined);
          return onLoad([{question_id: "1002"}]);
        };
      }
      var called = false;
      var options = {
        questionFactory: {
          generate: function(result) {
            called = true;
            return result;
          },
        },
      };
      var subject = new QuestionService(mockResource, mockAuthService, options);
      subject.getQuestions(function(err, result) {
        expect(called).to.eql(true);
        expect(err).to.eql(undefined);
        expect(result.length).to.eql(1);
        expect(result[0].question_id).to.eql('1002');
        done();
      });
    });
  });

  describe('answerQuestions', function() {
    it('returns an error if request and authservice are not present', function(done) {
      var subject = new QuestionService();
      subject.answerQuestions(undefined, function(err) {
        expect(err).to.eql('Request and AuthService are required');
        done();
      });
    });

    it('returns an error if no answers are given', function(done) {
      var subject = new QuestionService({}, {});
      subject.answerQuestions(undefined, function(err) {
        expect(err).to.eql('Answers are required');
        done();
      });
    });

    it('returns an error if answers are empty', function(done) {
      var subject = new QuestionService({}, {});
      subject.answerQuestions([], function(err) {
        expect(err).to.eql('Answers are required');
        done();
      });
    });

    it('returns an error if token is not present', function(done) {
      var mockAuth = {
        getAccessToken: function() {
          return;
        }
      }
      var subject = new QuestionService({}, mockAuth);
      subject.answerQuestions([{question_id: '1', answers: ['a']}], function(err) {
        expect(err).to.eql('Token is needed to answer questions');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      var mockAuthService = {
        getAccessToken: function() {
          return 'token';
        },
      };
      function mockResource(url, params, method) {
        this.answerQuestions = function(){};
        expect(url).to.contain('/user/questions');
        expect(params).to.eql(undefined);
        expect(method.answerQuestions.headers.Authorization).to.eql('token');
        done();
      }
      var subject = new QuestionService(mockResource, mockAuthService);
      subject.answerQuestions([{question_id: '1', answers: ['a']}], function(err) {
        expect(err).to.eql(undefined);
      });
    });

    it('returns an error from the server', function(done) {
      var answers = [{question_id: '1', answers: ['a']}];
      var mockAuthService = {
        getAccessToken: function() {
          return 'token';
        },
      };
      function mockResource(url, params, method) {
        this.answerQuestions = function(body, onLoad, onError){
          expect(body.answers).to.eql(answers);
          onError('Error');
        };
      }
      var subject = new QuestionService(mockResource, mockAuthService);
      subject.answerQuestions(answers, function(err) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('returns no error when succesful put', function(done) {
      var answers = [{question_id: '1', answers: ['a']}];
      var mockAuthService = {
        getAccessToken: function() {
          return 'token';
        },
      };
      function mockResource(url, params, method) {
        this.answerQuestions = function(body, onLoad, onError){
          expect(body.answers).to.eql(answers);
          onLoad();
        };
      }
      var subject = new QuestionService(mockResource, mockAuthService);
      subject.answerQuestions(answers, function(err) {
        expect(err).to.eql(undefined);
        done();
      });
    });
  });
});
