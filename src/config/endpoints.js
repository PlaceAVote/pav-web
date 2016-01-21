var urls = require('./urls.js');

module.exports = {
  facebookAppId: urls.FACEBOOKAPPID,
  methods: {
    get: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    getArray: {
      method: 'GET',
      isArray: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    getStatus: {
      method: 'GET',
      transformResponse: [],
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    del: {
      delete: function(id, token) {
        req = {
          method: 'DELETE',
          data: id,
          isArray: false,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
          },
          withCredentials: false,
        };
        return req;
      },
    },
    put: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    putNoBody: {
      method: 'PUT',
      transformResponse: [],
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    post: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
      endpoint: urls.VOTES + '/vote',
    },
    voteRecords: {
      endpoint: urls.VOTES + '/vote/bill/',
    },
  },
  comments: {
    reply: {
      endpoint: function(id) {
        id = id.trim();
        return urls.CONGRESS + '/comments/' + id + '/reply';
      },
    },
    like: {
      endpoint: function(id) {
        id = id.trim();
        return urls.CONGRESS + '/comments/' + id + '/like';
      },
    },
    dislike: {
      endpoint: function(id) {
        id = id.trim();
        return urls.CONGRESS + '/comments/' + id + '/dislike';
      },
    },
  },
  bills: {
    comments: {
      endpoint: function(id, from) {
        return urls.CONGRESS + '/bills/' + id + '/comments' + '?from=' + from;
      },
    },
    trends: {
      endpoint: urls.CONGRESS + '/bills/trending',
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
    feed: urls.USER + '/user/feed/',
  },
  notifications: {
    socket: urls.NOTIFICATION + '/user/notifications/ws',
    poll: urls.NOTIFICATION + '/user/notifications',
    staticEndpoint:  urls.USER + '/user/notifications',
    read: function(id) {
      return urls.USER + '/user/notification/' + id + '/mark';
    },
  },
  users: {
    endpoint: urls.USER + '/user',
    authorize: urls.USER + '/user/token/validate?token=',
    profile: {
      fromId: function(id) {
        return urls.USER + '/user/' + id + '/profile';
      },
    },
    timeline: function(id) {
      return urls.USER + '/user/' + id + '/timeline';
    },
    followers: function(id) {
      return urls.USER + '/user/' + id + '/followers';
    },
    following: function(id) {
      return urls.USER + '/user/' + id + '/following';
    },
    follow: urls.USER + '/user/follow',
    unfollow: urls.USER + '/user/unfollow',
    loginEndpoint: urls.USER + '/user/authenticate',
    facebookLoginUrl: urls.USER + '/user/facebook/authenticate',
    facebookCreateUrl: urls.USER + '/user/facebook',
    issue: {
      endpoint: urls.USER + '/user/issue',
      response: function(id) {
        return urls.USER + '/user/' + id + '/response';
      },
    },
    settings: urls.USER + '/user/me/settings',
  },
  search: {
    endpoint: urls.SEARCH + '/search',
  },
  password: {
    reset: function(email) {
      return urls.USER + '/password/reset?email=' + email;
    },
    newPassword: urls.USER + '/password/reset/confirm/',
    change: urls.USER + '/password/change',
  },
};
