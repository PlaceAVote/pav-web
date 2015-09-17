module.exports = {
    users : {
                create_endpoint : 'http://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user',
                create : {
                    method : 'PUT',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    withCredentials : false
                },
                login_endpoint: 'http://pav-user-api-1888417595.us-west-2.elb.amazonwas.com:8080/user/authenticate',
                login: {
                           method: 'POST',
                           headers: {
                                'Content-Type': 'application/json'
                           },
                           withCredentials: false
                }
            }
}
