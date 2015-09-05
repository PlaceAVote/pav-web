function RegisterController($scope, $location, userAuth){
$scope.register = this;
this.selected = false;

this.go = function(hash) {
	$location.path(hash);
}

this.select = function(){
	this.selected = this.selected ? false : true;
	return this.selected;
}

}

module.exports = RegisterController;

/*app.controller('TopicRegisterCtrl', ['$scope','$location', 'userAuth', function($scope, $location, userAuth) {
*/
