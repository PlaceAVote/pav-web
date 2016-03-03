function generateMessage(message) {
  var encoded = message.replace(/\s/g, '%20');
  encoded = encoded.replace(/@/, '%40');
  return encoded;
}

function generateLink(link) {
  link = encodeURIComponent(link);
  return link;
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
