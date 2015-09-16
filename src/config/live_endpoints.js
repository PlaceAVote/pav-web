module.exports = {
    users : {
                endpoint : 'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user',
                create : {
                    method : 'PUT',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    withCredentials : false
                },
                addUserToken: function(token) {
                                  this.create.headers['PAV-USER-AUTH'] = token;
                              }
            }
}
