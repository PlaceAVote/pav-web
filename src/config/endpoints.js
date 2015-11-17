var CONGRESS = 'http://pav-congress-api-515379972.us-east-1.elb.amazonaws.com:8080';
var USER = 'http://pav-user-api-924234322.us-east-1.elb.amazonaws.com:8080';
var VOTES = 'http://pav-vote-api-143877429.us-east-1.elb.amazonaws.com:8080';

module.exports = {
  facebookAppId: '1686805824874862',
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
      endpoint: CONGRESS + '/legislators/',
    },
  },
  votes: {
    getForBill: {
      endpoint: VOTES + '/vote/count?bill-id=',
    },
    voteOnBill: {
      endpoint: VOTES + '/vote'
    },
    voteRecords: {
      endpoint: VOTES + '/vote/bill/'
    }
  },
  comments: {
    reply: {
      endpoint: function(id) {
        id = id.trim();
        return CONGRESS + '/comments/' + id + '/reply'
      },
    },
    like: {
      endpoint: function(id) {
        id = id.trim();
        return CONGRESS + '/comments/' + id + '/like'
      }
    },
    dislike: {
      endpoint: function(id) {
        id = id.trim();
        return CONGRESS + '/comments/' + id + '/dislike'
      }
    },
  },
  bills: {
    comments: {
      endpoint: function(id, from) {
        return CONGRESS + '/bills/' + id + '/comments' + '?from=' + from
      },
    },
    postComment: {
      endpoint: CONGRESS + '/bills/comments',
    },
    topComments: {
      endpoint: function(id) {
        return CONGRESS + '/bills/' + id + '/topcomments';
      },
    },
    getById: {
      endpoint: CONGRESS + '/bills/',
    },
  },
  users : {
    endpoint : USER + '/user',
    profile: {
      me : USER + '/user/me/profile',
      fromId: function(id) {
        return USER + '/user/' + id + '/profile'
      },
    },
    login_endpoint: USER + '/user/authenticate',
    facebookLoginUrl : USER + '/user/facebook/authenticate',
    facebookCreateUrl: USER + '/user/facebook',
  },
}

