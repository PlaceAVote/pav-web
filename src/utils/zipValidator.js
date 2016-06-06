var zipExpression = /^\d{5}(?:[-\s]\d{4})?$/;
function zipValidator(zip) {
  if (!zip) {
    return false;
  }
  return zipExpression.test(zip);
}

module.exports = zipValidator;
