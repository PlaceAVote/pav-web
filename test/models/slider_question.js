var Slider = require('../../src/models/slider_question.js');
var expect = require('chai').expect;

describe('Slider Question', function() {
  describe('instantiation', function() {
    it('converts answers into an array', function() {
      var answers = {
        left: 'I want less gun control',
        middle: 'Not sure',
        right: 'I want more gun control',
      };
      options = {
        answers: answers,
      }

      var subject = new Slider(options);
      expect(subject.answers.length).to.eql(3);
      expect(subject.answers[0]).to.eql('I want less gun control');
      expect(subject.answers[1]).to.eql('Not sure');
      expect(subject.answers[2]).to.eql('I want more gun control');
    });

  });

  describe('get position', function() {

    it('Gets the position of the slider', function() {
      var subject = new Slider(options);
      expect(subject.position).to.eql(1);
      var position = subject.getPosition();
      expect(position).to.eql('Not sure');
    });

    it('returns undefined if position is outside of index', function() {
      var subject = new Slider(options);
      subject.position = 5;
      var position = subject.getPosition();
      expect(position).to.eql(undefined);
    });

  });
  describe('transform', function() {
    it('it converts the model ready to be sent in a post request', function() {
      var answers = {
        left: 'I want less gun control',
        middle: 'Not sure',
        right: 'I want more gun control',
      };
      options = {
        question_id: '1001',
        answers: answers,
      };
      var subject = new Slider(options);
      subject.position = 2;
      var transformed = subject.transform();
      expect(transformed.question_id).to.eql('1001');
      expect(transformed.answers.length).to.eql(1);
      expect(transformed.answers).to.eql(['I want more gun control']);
    });
  });
});
