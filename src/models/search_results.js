function SearchResults(options) {
	this.bills = [];
	this.users = [];
	for(var i in options) {

		var that = this;

		if(options[i].type == 'bill') {
			that.bills.push({
				bill_id: options[i].bill_id,
				official_title: options[i].official_title,
				short_title: options[i].short_title,
				subject: options[i].subject,
				type: options[i].type
			});
		}

		if(options[i].type == 'users') {
			that.users.push({
				first_name: options[i].first_name,
				last_name: options[i].last_name,
				img_url: options[i].img_url || '//cdn.placeavote.com/img/profile/profile-picture.png',
				user_id: options[i].user_id,
				type: options[i].type
			})
		}
	}
}

module.exports = SearchResults;


//Bill
// bill_id: "hr1084-114"
// official_title: "To amend title 49, United States Code, to modify the criteria for selecting communities to participate in the Small Community Air Service Development Program, and for other purposes."
// short_title: "21st Century SCASDP Act"
// subject: "Transportation and public works"
// type: "bill"

//Person
// first_name: "Anthony"
// img_url: "https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/p50x50/10469211_10152710867987642_20738644433110700_n.jpg?oh=2ed232ef0cb448a2551308ea0fd1e58a&oe=56DD1CF3"
// last_name: "O'Neill"
// type: "users"
// user_id: "161767d0-5fce-4c05-8953-4b19cd5af0b2"