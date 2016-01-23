var Wizard = require('../../src/controllers/wizard_controller.js');
var expect = require('chai').expect;

describe('Wizard', function() {
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
  });

  describe('skip', function() {
    var subject = new Wizard();
    subject.currentQuestion = 'skip';
    subject.skipQuestion();
    expect(subject.skipped.length).to.eql(1);
    expect(subject.skipped[0]).to.eql('skip');
    expect(subject.currentQuestion).to.eql(null);
  });
});
