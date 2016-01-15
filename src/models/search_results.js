var Icon = require('./icon.js');
function SearchResults(options) {
	this.bills = [];
	this.users = [];
	var x = 0;
	for(var i in options) {

		var that = this;

		if(options[i].type == 'bill') {
			that.bills.push({
				bill_id: options[i].bill_id,
				official_title: options[i].official_title,
				short_title: options[i].short_title,
				type: options[i].type,
				selected: false,
				subject: options[i].subject,
				goToBill: function(location, bill_id) {
					location.path('bill/' + bill_id);
				}
			});
			that.fullTitle(options[i], x);
			that.getIcon(options[i], x);
			x++;
		}

		if(options[i].type == 'users') {
			that.users.push({
				first_name: options[i].first_name,
				last_name: options[i].last_name,
				img_url: options[i].img_url || '//cdn.placeavote.com/img/profile/profile-picture.png',
				user_id: options[i].user_id,
				type: options[i].type,
				full_title: options[i].first_name + ' ' + options[i].last_name,
				html: options[i].first_name + ' ' + options[i].last_name,
				selected: false,
				goToProfile: function(location, user_id) {
					location.path('profile/' + user_id);
				}
			})
		}
	}
}

SearchResults.prototype.fullTitle = function(o, x) {
	var that = this;
	if(o.short_title == null) {
		that.bills[x].full_title = o.bill_id + ' ' + o.official_title;
		that.bills[x].html = o.bill_id + ' ' + o.official_title;
	} else {
		that.bills[x].full_title = o.bill_id + ' ' + o.short_title;
		that.bills[x].html = o.bill_id + ' ' + o.short_title;
	}

}

SearchResults.prototype.getIcon = function(o, x) {
	var that = this;
	Icon(o, function(i) {that.bills[x].icon = i;})
}

module.exports = SearchResults;

