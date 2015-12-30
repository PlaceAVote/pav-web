module.exports = {
		title: function(t, n) {
			if(!t) {
				if(typeof window == "undefined") {
					return;
				}

				t = window.document.title;
				t = t.split(') ').pop(); 
				window.document.title = n + t;
			}
			if(!n) {
				if(typeof window == "undefined") {
					return;
				}
				ot = window.document.title;
				ot = ot.split('Place').shift();
				window.document.title = ot + this.main + t;
			}
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
		},
		notifications: function(n) {
			if(n) {
			this.title(undefined, '('+n+') ');
			} else {
			this.title(undefined,'');
			}
		}

}