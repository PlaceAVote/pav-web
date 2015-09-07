app.factory('countryCodes', function($http) { 
   return $http.get('http://127.0.0.1:8080/dist/js/countrycodes.json');
});

