var lowerTeens = ['11', '12', '13'];

function handleLowerTeen(num) {
  return num.toString() + 'th';
}

function isLowerTeen(numbString) {
  for (var i = 0; i < lowerTeens.length; i++) {
    if (numbString.endsWith(lowerTeens[i])) {
      return true;
    }
  }
  return false;
}

function numberSuffixer(num) {
  var numbString = num.toString();
  if (isLowerTeen(numbString)) {
    return handleLowerTeen(num);
  }
  switch (numbString.charAt(numbString.length - 1)) {
    case '1': {
      numbString = numbString + 'st';
      break;
    }
    case '2': {
      numbString = numbString + 'nd';
      break;
    }
    case '3': {
      numbString = numbString + 'rd';
      break;
    }
    case '0': case '4': case '5': case '6':
    case '7': case '8': case '9': {
      numbString = numbString + 'th';
      break;
    }
  }
  return numbString;
}

module.exports = numberSuffixer;
