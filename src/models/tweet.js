function generateMessage(message) {
  var encoded = message.replace(/\s/g, '%20');
  encoded = encoded.replace(/@/, '%40');
  return encoded;
}

// Removes the insisten hash angular puts in the url
function generateLink(link) {
  var removed = link.replace(/#\//, '');
  return removed;
}

function tweet() {
  return {
    generateMessage: function(message) {
      return generateMessage(message);
    },
    generateLink: function(link) {
      return generateLink(link);
    },
  };
}

module.exports = tweet;
