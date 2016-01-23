function QuestionBase(options) {
  this.id = options.question_id;
  this.type = options.question_type;
  this.answers = options.answers;
  this.topic = options.topic;
}

module.exports = QuestionBase;
