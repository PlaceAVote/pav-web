var urls = require('./urls.js');

module.exports = {
  facebookAppId: urls.FACEBOOKAPPID,
  mandrillKey: urls.MANDRILAPIKEY,
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
    postArray: {
      method: 'POST',
      isArray: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    postImg: {
      method: 'POST',
      headers: {
        'Content-Type': undefined,
        Accept: 'application/json',
      },
      withCredentials: false,
    },
    postData: function(data, token) {
      req = {
        method: 'POST',
        data: data,
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
    putData: function(data, token) {
      req = {
        method: 'PUT',
        data: data,
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
  },
  feed: {
    endpoint: urls.USER + '/user/feed/',
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
    questions: urls.USER + '/user/questions',
    profile: {
      fromId: function(id) {
        return urls.USER + '/user/' + id + '/profile';
      },
      open: urls.USER + '/user/profile/',
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
        return urls.USER + '/user/issue/' + id + '/response';
      },
    },
    settings: urls.USER + '/user/me/settings',
    profilePicture: urls.USER + '/user/me/profile/image',
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
  mandrill: {
    endpoint: 'https://mandrillapp.com/api/1.0//messages/send.json',
  },
};
