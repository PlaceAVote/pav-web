function validate(issue) {
  if (!issue) {
    return false;
  }
  if (issue.comment) {
    return true;
  }
  if (issue.article_link) {
    return true;
  }
  return false;
}

function issueValidator() {
  return {
    validate: validate,
  };
}

module.exports = issueValidator;
