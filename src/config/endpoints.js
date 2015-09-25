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
                get_endpoint: 'http://192.168.99.100:8080/user/',
                get: {
                    method: 'GET',
                    headers: {
                        'Content-Type':'application/json'
                    }
                },
                facebookLoginUrl : 'http://192.168.99.100:8080/user/facebook/authenticate',
                facebook: {
                    login : {
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json'
                                },
                                withCredentials: false
                            },
                    create: {
                                method: 'POST',
                                headers: {
                                    'Content-Type':'application/json'
                                },
                                withCredentials: false
                            },
                },
                facebookCreateUrl: 'http://192.168.99.100:8080/user/facebook'
            }
}
