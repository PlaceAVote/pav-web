app.factory('loginUser', ['$http', function($http) {
  return $http.get('api-endpoint')
         .success(function(data) {
           return data;
         })
         .error(function(data) {
           return data;
         });
}]);