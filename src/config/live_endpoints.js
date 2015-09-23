module.exports = {
    users : {
                create_endpoint : 'https://pav-user-api-1888417595.us-west-2.elb.amazonaws.com:8080/user',
                create : {
                    method : 'PUT',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    withCredentials : false
                },
                login_endpoint: 'https://pav-user-api-1888417595.us-west-2.elb.amazonwas.com:8080/user/authenticate',
                login: {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: false
                },
                facebookLoginUrl : 'https://pav-user-api-1888417595.us-west-2.elb.amazonwas.com:88080/user/fblogin',
                facebook: {
                    login : {
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json'
                                },
                                withCredentials: false
                            }

                },
                facebookCreateUrl: 'http://pav-user-api-1888417595.us-west-2.elb.amazonwas.com:88080/user/facebook'
            }
}
