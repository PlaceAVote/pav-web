var Interest = require("../Models/interest.js");

function RegisterController($scope, $location, userAuth){
$scope = $scope || {};
$scope.register = this;
this.location = $location;
this.interests = [
	new Interest('Religion', 'icon-religion'),
	new Interest('Drugs', 'icon-smoking-area'),
	new Interest('Defense', 'icon-tank'),
	new Interest('Politics','icon-building'),
	new Interest('Gun Rights','icon-gun'),
	new Interest('Technology','icon-ipad'),
	new Interest('Economics', 'icon-money'),
	new Interest('Social Interest','icon-police')
];

}
RegisterController.prototype.go = function(hash) {
	this.location.path(hash);
}

RegisterController.prototype.select = function(name) {
	var interest = this.getInterest(name);
	if (interest) {
		interest.select();
	}
	
}

RegisterController.prototype.getInterest = function(name) {
	var len = this.interests.length;
	for(var i = len -1; i >= 0; i --){
		if(this.interests[i].name === name){
			return this.interests[i];
		}
	}
};


module.exports = RegisterController;

/*app.controller('TopicRegisterCtrl', ['$scope','$location', 'userAuth', function($scope, $location, userAuth) {
*/
