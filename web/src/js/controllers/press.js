function PressCtrl($scope, $location) {
	$scope.press = this;
	this.articles = [
		{
			quote: 'Placeavote is awesome. It brings us a true democracy by allowing constituents to let representatives know how they think he/she should vote on any given bill. This is the new GovTech. Imagine being a Congressman and knowing exactly how you should vote on every issue to support your constituents.',
			img: 'img/press/tim.png'
		},
		{
			quote: 'Placeavoteote could change the way we do politics, and give citizens back the power to govern themselves.',
			link: '',
			img: 'img/press/buzzfeed.png'
		},
		{
			quote: 'If ever there was a time to push an alternative political party or completely over-ambitious idea to automate the House of Representatives, now may be the time.',
			link: '',
			img: 'img/press/vice.png'
		},
		{
			quote: 'The most transparent voting system ever devised',
			link: '',
			img: 'img/press/industry-tap.png'
		},
		{
			quote: 'What would change if politicians wrote laws based on internet polls?',
			link: '',
			img: 'img/press/gizmodo.png'
		},
		{
			quote: 'Is crowdsourced, real-time voting on legislation the way of the future?',
			link: '',
			img: 'img/press/realclear.png'
		},
		{
			quote: 'Placeavote is simply a digital polling platform.',
			link: '',
			img: 'img/press/engadget_logo.png'
		},
	];
}

module.exports = PressCtrl;