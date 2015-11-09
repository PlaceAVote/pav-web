var CONGRESS = 'http://pav-congress-api-515379972.us-east-1.elb.amazonaws.com:8080';
var USER = 'http://pav-user-api-924234322.us-east-1.elb.amazonaws.com:8080';
var VOTES = 'http://pav-vote-api-1303687856.us-east-1.elb.amazonaws.com:8080/';


module.exports = {
  facebookAppId: '1686777641544347',
  methods: {
    get: {
      method: 'GET',
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
  },
  comments: {
    reply: {
      endpoint: function(id) {
        return CONGRESS + '/comments/' + id + '/reply'
      },
    },
    like: {
      endpoint: function(id) {
        return CONGRESS + '/comments/' + id + '/like'
      }
    },
    dislike: {
      endpoint: function(id) {
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
    login_endpoint: USER + '/user/authenticate',
    facebookLoginUrl : USER + '/user/facebook/authenticate',
    facebookCreateUrl: USER + '/user/facebook',
  },
}

