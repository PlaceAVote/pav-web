function UserNotFound($location) {
  this.location = $location;
}

UserNotFound.prototype.returnToFeed = function() {
  this.location.path('/feed');
};

module.exports = UserNotFound;
