module.exports = {
		title: function(t, n) {
			n = n || '';
			window.document.title = n + this.main + t;
		},
		main: 'Place A Vote | ',
		profile: function(user) {
			this.title(user.first_name + ' ' + user.last_name);
		},
		bill: function(bill) {
			billTitle = bill.short_title || bill.official_title;
			this.title(billTitle);
		},
		feed: function() {
			this.title('Feed');
		}
}