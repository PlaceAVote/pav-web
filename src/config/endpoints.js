module.exports = {
    users : {
                endpoint : 'http://192.168.99.100:8080/user/',
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
