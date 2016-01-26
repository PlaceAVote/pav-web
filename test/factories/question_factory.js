var expect = require('chai').expect;
var questionFactory = require('../../src/factories/question_factory.js');
var Slider = require('../../src/models/slider_question.js');
var DragAndDrop = require('../../src/models/drag_and_drop_question.js');

describe('question factory', function() {
  it('returns an array of the same length that entered', function() {
    var result = questionFactory.generate([{question_id: '1002'}]);
    expect(result.length).to.eql(1);
  });

  it('returns a slider type', function() {
    var result = questionFactory.generate([{question_id: '1002', question_type: 'slider'}]);
    expect(result.length).to.eql(1);
    console.log(result[0]);
    expect(result[0]).to.be.an.instanceof(Slider);
  });

  it('returns a drag and drop type', function() {
    var result = questionFactory.generate([{question_id: '1002', question_type: 'dragdrop'}]);
    expect(result.length).to.eql(1);
    console.log(result[0]);
    expect(result[0]).to.be.an.instanceof(DragAndDrop);
  });

});

