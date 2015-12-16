function TeamController($scope, $location) {
  $scope.team = this;
  console.log('team controller');
  this.founders = [
  	{
  		img: 'img/web/profile-imgs/luke-davis.jpg',
  		name: 'Luke Davis',
  		role: 'Co-Founder',
  		twitter: false,
  		linkedin: '/in/lukejdavis'
  	},
  	 {
  		img: 'img/web/profile-imgs/ben-colman.jpg',
  		name: 'Ben Colman',
  		role: 'Co-Founder',
  		twitter: false,
  		linkedin: '/in/bcolman'
  	},
    {
      img: 'img/web/profile-imgs/job-melton.jpg',
      name: 'Job Melton',
      role: 'Executive Director of Placeavote.org',
      twitter: false,
      linkedin: '/pub/job-melton/2/421/57'
    }
  ];
  this.designdev = [
  	{
  		img: 'img/web/profile-imgs/john-irvine.jpg',
  		name: 'John Ervine',
  		role: 'Lead Software Engineer',
  		twitter: 'jervine791',
  		linkedin: '/pub/john-ervine/55/899/9bb'
  	},
  	 {
  		img: 'img/web/profile-imgs/dave-hawkins.jpg',
  		name: 'Dave Hawkins',
  		role: 'Lead UX Designer',
  		twitter: 'davehawkins',
  		linkedin: false
  	},
  	 {
  		img: 'img/web/profile-imgs/gary-brown.jpg',
  		name: 'Gary Brown',
  		role: 'Lead UX Designer',
  		twitter: 'garybrowntown',
  		linkedin: false
  	},
       {
      img: 'img/web/profile-imgs/anthony-oneill.jpg',
      name: "Anthony O'Neill",
      role: 'Front End Developer',
      twitter: 'niblince',
      linkedin: false
    },
  	 {
  		img: 'img/web/profile-imgs/paul-barber.jpg',
  		name: 'Paul Barber',
  		role: 'Front End Engineer',
  		twitter: 'HistoireDeBabar',
  		linkedin: '/pub/paul-barber/78/130/8ab'
  	}
  ];

 // this.campaign = [
 // 		  {
 // 		img: 'img/web/profile-imgs/josh-dennison.jpg',
 // 		name: 'Josh Dennison',
 // 		role: 'Director of Political Strategy',
 // 		twitter: 'JoshDPAV',
 // 		linkedin: false
 //	}
 //];
}

module.exports = TeamController;
