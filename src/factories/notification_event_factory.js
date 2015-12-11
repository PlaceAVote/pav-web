var NotificationEventFactory = {

  getResponse: function(response) {
    if(!response || !response.type) {
      throw {message: 'No Type Defined'};
    }
    switch (response.type) {
      default:
        console.log(response);
        return response;
    };
  },

  getResponses: function(responses) {
    var results = [];
    for(var i = 0; i < responses.length; i++) {
      results.push(NotificationEventFactory.getResponse(responses[i]));
    }
    return results
  },
};

module.exports = NotificationEventFactory;

