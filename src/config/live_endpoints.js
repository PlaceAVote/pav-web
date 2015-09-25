module.exports = {
    users : {
                create_endpoint : 'https://pav-user-api-1888417595.us-west-2.elb.amazonaws.com/user',
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
                get_endpoint: 'https://pav-user-api-1888417595.us-west-2.elb.amazonwas.com/user/',
                get: {
                    method: 'GET',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    withCredentials: false
                },
                facebookLoginUrl : 'https://pav-user-api-1888417595.us-west-2.elb.amazonwas.com/user/facebook/authenticate',
                facebook: {
                    login : {
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json'
                                },
                                withCredentials: false
                            },
                    create: {
                                method: 'PUT',
                                headers: {
                                    'Content-Type':'application/json'
                                },
                                withCredentials: false
                            },
                },
                facebookCreateUrl: 'https://pav-user-api-1888417595.us-west-2.elb.amazonwas.com/user/facebook'
            }
}
