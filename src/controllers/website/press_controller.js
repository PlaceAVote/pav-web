function PressController($scope, $location) {
	$scope.press = this;
	this.articles = [
		{
			quote: 'Placeavote is awesome. It brings us a true democracy by allowing constituents to let representatives know how they think he/she should vote on any given bill. This is the new GovTech. Imagine being a Congressman and knowing exactly how you should vote on every issue to support your constituents.',
			img: 'img/web/press/tim.png'
		},
		{
			quote: 'Place A Vote could change the way we do politics, and give citizens back the power to govern themselves.',
			title: 'Five Services We All Must Use In the Wake Of Ferguson',
			link: 'http://www.buzzfeed.com/robbgilchrist/5-services-we-all-must-use-in-the-wake-of-ferguson-xaha',
			img: 'img/web/press/buzzfeed.png'
		},
		{
			quote: 'If ever there was a time to push an alternative political party or completely over-ambitious idea to automate the House of Representatives, now may be the time.',
			title: 'The Startup Trying to Replace Congress With Software Is Running Candidatesa',
			link: 'http://motherboard.vice.com/read/the-startup-trying-to-replace-congress-with-software-has-two-candidates-running',
			img: 'img/web/press/vice.png'
		},
		{
			quote: 'The most transparent voting system ever devised.',
			title: 'Smart Voting Software Aims to Replace Politicians with Direct Democracy',
			link: 'http://www.industrytap.com/smart-voting-software-aims-replace-politicians-direct-democracy/20471',
			img: 'img/web/press/industry-tap.png'
		},
		{
			quote: 'What would change if politicians wrote laws based on internet polls?',
			title: 'What Would Change If Politicians Wrote Laws Based on Internet Polls?',
			link: 'http://gizmodo.com/what-would-change-if-politicians-wrote-laws-based-on-in-1581154518',
			img: 'img/web/press/gizmodo.png'
		},
		{
			quote: 'Is crowdsourced, real-time voting on legislation the way of the future?',
			title: 'Is Your Future Congressman A Machine?',
			link: 'http://www.realclear.com/tech/2014/06/20/is_your_future_congressman_going_to_be_a_machine_7548.html',
			img: 'img/web/press/realclear.png'
		},
		{
			quote: 'Placeavote is simply a digital polling platform.',
			title: 'PlaceAVote wants to replace politicians with internet polls',
			link: 'http://www.engadget.com/2014/05/24/replaceing-politicians-with-internet-polls/',
			img: 'img/web/press/engadget_logo.png'
		},
	];
}

module.exports = PressController;