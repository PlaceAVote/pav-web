var expect = require('chai').expect;
var DragAndDrop = require('../../src/models/drag_and_drop_question.js');

describe('Drag and Drog', function() {
  it('can transform the questions into a response for the server', function() {
    var data = {
      question_id: "1002",
      question_type: "dragdrop",
      question: "Which of these bills interests you, drag and drop in...",
      answers: [
        {
          bill_id: "hr2-114",
          bill_title: "Bill to make July 3rd National Cowboy Day"
        },
        {
          bill_id: "hr2-115",
          bill_title: "Bill to make July 5th National Cowboy Day"
        },
      ],
    };
    var question = new DragAndDrop(data);
    var subject = question.transform();
    var expected = {
      question_id: "1002",
      answers: ["hr2-114", "hr2-115"],
    };
    expect(subject).to.eql(expected);
  });
});
