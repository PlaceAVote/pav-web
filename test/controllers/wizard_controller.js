var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var Wizard;
var Slider = require('../../src/models/slider_question.js');

describe('Wizard', function() {
  jsdom();
  before(function() {
    Wizard = require('../../src/controllers/wizard_controller.js');
  });
  describe('getNextQuestion', function() {
    it('returns null if questions list is undefined', function() {
      var subject = new Wizard();
      var question = subject.getNextQuestion();
      expect(question).to.eql(null);
    });

    it('returns null if questions have length of zero', function() {
      var subject = new Wizard();
      subject.questions = [];
      var question = subject.getNextQuestion();
      expect(question).to.eql(null);
    });

    it('returns null if questions have length of zero', function() {
      var subject = new Wizard();
      subject.questions = [];
      var question = subject.getNextQuestion();
      expect(question).to.eql(null);
    });

    it('returns null if questions have length of combined skipped and answered', function() {
      var subject = new Wizard();
      subject.sendQuestions = function(){};
      subject.questions = ['hello', 'goodbye', 'world'];
      subject.answered = ['hello', 'world'];
      subject.skipped = ['goodbye'];
      var question = subject.getNextQuestion();
      expect(question).to.eql(null);
    });

    it('returns the next item in the list', function() {
      var subject = new Wizard();
      subject.questions = ['hello', 'goodbye', 'world'];
      subject.answered = ['hello'];
      subject.skipped = ['goodbye'];
      var question = subject.getNextQuestion();
      expect(question).to.eql('world');
    });
  });

  describe('answer question', function() {
    it('adds transformed current question into an answer array, setting the current question once complete', function() {
      var actualParams, called;
      var mockQuestion = {
        transform: function(params) {
          called = true;
            return 'hello';
        },
      };
      var subject = new Wizard();
      subject.currentQuestion = mockQuestion;
      subject.answerQuestion();
      expect(called).to.eql(true);
      expect(subject.answered.length).to.eql(1);
      expect(subject.answered[0]).to.eql('hello');
      expect(subject.currentQuestion).to.eql(null);
    });

    it('can add a slider object', function() {
      var answers = {
        left: 'I want less gun control',
        middle: 'Not sure',
        right: 'I want more gun control',
      };
      options = {
        question_id: '1001',
        answers: answers,
      };
      var question = new Slider(options);
      var subject = new Wizard();
      subject.sendQuestions = function(){};
      subject.currentQuestion = question;
      subject.questions = [question];
      question.position = 0;
      subject.answerQuestion();
      expect(subject.answered.length).to.eql(1);
      expect(subject.answered[0].answer[0]).to.eql('I want less gun control');
      expect(subject.answered[0].question_id).to.eql('1001');
    });
  });

  describe('skip', function() {
    before(function() {
      Wizard = require('../../src/controllers/wizard_controller.js');
    });
    it('should skip', function() {
      var subject = new Wizard();
      subject.currentQuestion = 'skip';
      subject.skipQuestion();
      expect(subject.skipped.length).to.eql(1);
      expect(subject.skipped[0]).to.eql('skip');
      expect(subject.currentQuestion).to.eql(null);
    });
  });

  describe('load questions', function() {
    before(function() {
      Wizard = require('../../src/controllers/wizard_controller.js');
    });
    it('loads the questions and returns the current one', function(done) {
      var called = false;
      var expectedQuestion = new Slider({question_id: '1'});
      var mockQuestionService = {
        getQuestions: function(callback) {
          called = true;
          callback(null, [expectedQuestion]);
        },
        answerQuestions: function(){},
      };
      var scope = {
        $watch: function(){},
      };
      var subject = new Wizard(scope, mockQuestionService);
      subject.loadQuestions(function(currentQuestion) {
        expect(called).to.eql(true);
        expect(currentQuestion).to.eql(expectedQuestion);
        console.log('sihsiufdsiughdsiufhds', subject.questions, subject.questions.length);
        expect(subject.questions.length).to.eql(2);
        expect(subject.questions[0]).to.eql(expectedQuestion);
        done();
      });
    });

    it('returns an error from server doesnt set questions', function(done) {
      var mockQuestionService = {
        getQuestions: function(callback) {
          callback('Error', null);
        },
      };
      var subject = new Wizard({}, mockQuestionService);
      subject.loadQuestions(function(currentQuestion) {
        expect(subject.questions).to.eql([]);
        expect(currentQuestion).to.eql(undefined);
        done();
      });
    });
  });
  describe('sendQuestions', function() {
    it('sends questions to the server', function(done){

      var actualAnswers;
      var mockQuestionService = {
        getQuestions: function(){},
        answerQuestions: function(answers, callback) {
          actualAnswers = answers;
          callback();
        },
      };

      var mockRootScope = {
        user: {
          newUser: true,
        },
      };

      var subject = new Wizard({}, mockQuestionService, mockRootScope);
      var expected = [
        {
          question_id: "1003",
          answers: ["18000", "ne333ax"]
        },
        {
          question_id: "1001",
          answers: ["this bill", "that bill"],
        },
      ];
      subject.answered = expected;
      subject.sendQuestions(function(err, result) {
        expect(actualAnswers).to.eql(expected);
        done();
      });
    });
  });
});
