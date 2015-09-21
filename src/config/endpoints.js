module.exports = {
    users : {
                create_endpoint : 'http://192.168.99.100:8080/user/',
                create : {
                    method : 'PUT',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    withCredentials : false
                },
                login_endpoint: 'http://192.168.99.100:8080/user/authenticate',
                login: {
                           method: 'POST',
                           headers: {
                                'Content-Type': 'application/json'
                           },
                           withCredentials: false
                },
                facebookLoginUrl : 'https://192.168.99.100:8080/user/fblogin',
                facebook: {
                    login : {
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json'
                                },
                                withCredentials: false
                            }

                }
            }
}
//PAV-USER-AUTH'
