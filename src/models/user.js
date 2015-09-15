function User(email, password) {
	this.email = email;
	this.password = password;
	this.topics;
	this.first_name;
	this.last_name;
	this.dob;
	this.country_code;
}

User.prototype.setToken = function(token) {
    this.token = token;
    this.password = undefined;
};

module.exports = User;
