module.exports = {
  facebookAppId: '1686777641544347',
  bills: {
    getById:{
      endpoint: 'http://pav-congress-api-196217309.us-west-2.elb.amazonaws.com:8080/bills/',
      method: {
        method: 'GET',
        headers: {
          'Content-Type' : "application/json",
          'Accept': 'application/json'
        },
        withCredentials: false,
      },
    },
  },
  users : {
    create_endpoint : 'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user',
    create : {
      method : 'PUT',
      headers: {
        'Content-Type' : "application/json",
        'Accept': 'application/json'
      },
      withCredentials : false
    },
    login_endpoint: 'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user/authenticate',
    login: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    },
    get_endpoint: 'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user',
    get: {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    },
    facebookLoginUrl : 'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user/facebook/authenticate',
    facebook: {
      login : {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      },
      create: {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      },
    },
    facebookCreateUrl:'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user/facebook'
  }
}
