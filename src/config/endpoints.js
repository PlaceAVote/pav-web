var urls = require('./urls.js');

module.exports = {
  facebookAppId: urls.FACEBOOKAPPID,
  methods: {
    get: {
      method: 'GET',
      headers: {
        'Content-Type' : "application/json",
        'Accept': 'application/json',
      },
      withCredentials: false,
    },
    getArray: {
      method: 'GET',
      isArray: true,
      headers: {
        'Content-Type' : "application/json",
        'Accept': 'application/json',
      },
      withCredentials: false,
    },
    put: {
      method: 'PUT',
      headers: {
        'Content-Type' : "application/json",
        'Accept': 'application/json',
      },
      withCredentials: false,
    },
    post: {
      method: 'POST',
      headers: {
        'Content-Type' : "application/json",
        'Accept': 'application/json',
      },
      withCredentials: false,
    },
  },
  legislator: {
    getById: {
      endpoint: urls.CONGRESS + '/legislators/',
    },
  },
  votes: {
    getForBill: {
      endpoint: urls.VOTES + '/vote/count?bill-id=',
    },
    voteOnBill: {
      endpoint: urls.VOTES + '/vote'
    },
    voteRecords: {
      endpoint: urls.VOTES + '/vote/bill/'
    }
  },
  comments: {
    reply: {
      endpoint: function(id) {
        id = id.trim();
        return urls.CONGRESS + '/comments/' + id + '/reply'
      },
    },
    like: {
      endpoint: function(id) {
        id = id.trim();
        return urls.CONGRESS + '/comments/' + id + '/like'
      }
    },
    dislike: {
      endpoint: function(id) {
        id = id.trim();
        return urls.CONGRESS + '/comments/' + id + '/dislike'
      }
    },
  },
  bills: {
    comments: {
      endpoint: function(id, from) {
        return urls.CONGRESS + '/bills/' + id + '/comments' + '?from=' + from
      },
    },
    postComment: {
      endpoint: urls.CONGRESS + '/bills/comments',
    },
    topComments: {
      endpoint: function(id) {
        return urls.CONGRESS + '/bills/' + id + '/topcomments';
      },
    },
    getById: {
      endpoint: urls.CONGRESS + '/bills/',
    },
  },
  users : {
    endpoint : urls.USER + '/user',
    profile: {
      me : urls.USER + '/user/me/profile',
      fromId: function(id) {
        return urls.USER + '/user/' + id + '/profile'
      },
    },
    login_endpoint: urls.USER + '/user/authenticate',
    facebookLoginUrl : urls.USER + '/user/facebook/authenticate',
    facebookCreateUrl: urls.USER + '/user/facebook',
  },
}

