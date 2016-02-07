function QuestionBase(options) {
  options = options || {};
  this.id = options.question_id;
  this.type = options.question_type;
  this.answers = options.answers;
  this.topic = options.topic;
  this.extension = options.extension;
  this.scope = options.scope;
}

module.exports = QuestionBase;
