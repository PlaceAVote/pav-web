var validator = require('../../src/utils/validate_issue.js')();
var expect = require('chai').expect;

describe('issue validator', function() {
  it('returns false when issue is undefined', function() {
    var result = validator.validate()
    expect(result).to.eql(false);
  });

  it('returns true when issue has defined comment', function() {
    var issue = {
      comment: 'hello',
    };
    var result = validator.validate(issue)
    expect(result).to.eql(true);
  });

  it('returns false when issue has empty comment', function() {
    var issue = {
      comment: '',
    };
    var result = validator.validate(issue)
    expect(result).to.eql(false);
  });

  it('returns true when issue has empty comment but has article links', function() {
    var issue = {
      comment: '',
      article_link: 'testTitle',
    };
    var result = validator.validate(issue)
    expect(result).to.eql(true);
  });

  it('returns false when only a bill link is posted', function() {
    var issue = {
      comment: '',
      article_link: '',
      bill_id: 'hr-test',
    };
    var result = validator.validate(issue)
    expect(result).to.eql(false);
  });

  it('returns true when a bill link is posted with a comment', function() {
    var issue = {
      comment: 'hello',
      article_link: '',
      bill_id: 'hr-test',
    };
    var result = validator.validate(issue)
    expect(result).to.eql(true);
  });

  it('returns true when a bill link is posted with an article', function() {
    var issue = {
      comment: '',
      article_link: 'www.test.com',
      bill_id: 'hr-test',
    };
    var result = validator.validate(issue)
    expect(result).to.eql(true);
  });
});

