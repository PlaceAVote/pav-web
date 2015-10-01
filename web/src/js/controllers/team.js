function TeamCtrl($scope, $location) {
  $scope.team = this;
  this.founders = [
  	{
  		img: 'img/profile-imgs/luke-davis.jpg',
  		name: 'Luke Davis',
  		role: 'Co-Founder',
  		twitter: false,
  		linkedin: '/in/lukejdavis'
  	},
  	 {
  		img: 'img/profile-imgs/ben-colman.jpg',
  		name: 'Ben Colman',
  		role: 'Co-Founder',
  		twitter: false,
  		linkedin: '/in/bcolman'
  	},
    {
      img: 'img/profile-imgs/job-melton.jpg',
      name: 'Job Melton',
      role: 'Executive Director of Placeavote.org',
      twitter: false,
      linkedin: '/pub/job-melton/2/421/57'
    }
  ];
  this.designdev = [
  	{
  		img: 'img/profile-imgs/john-irvine.jpg',
  		name: 'John Ervine',
  		role: 'Lead Software Engineer',
  		twitter: 'jervine791',
  		linkedin: '/pub/john-ervine/55/899/9bb'
  	},
  	 {
  		img: 'img/profile-imgs/dave-hawkins.jpg',
  		name: 'Dave Hawkins',
  		role: 'Lead UX Designer',
  		twitter: 'davehawkins',
  		linkedin: false
  	},
  	 {
  		img: 'img/profile-imgs/gary-brown.jpg',
  		name: 'Gary Brown',
  		role: 'Lead UX Designer',
  		twitter: false,
  		linkedin: false
  	},
       {
      img: 'img/profile-imgs/anthony-oneill.jpg',
      name: "Anthony O'Neill",
      role: 'Front End Developer',
      twitter: 'niblince',
      linkedin: false
    },
  	 {
  		img: 'img/profile-imgs/paul-barber.jpg',
  		name: 'Paul Barber',
  		role: 'Front End Engineer',
  		twitter: 'HistoireDeBabar',
  		linkedin: '/pub/paul-barber/78/130/8ab'
  	}
  ];

  this.campaign = [
  		  {
  		img: 'img/profile-imgs/josh-dennison.jpg',
  		name: 'Josh Dennison',
  		role: 'Director of Political Strategy',
  		twitter: 'JoshDPAV',
  		linkedin: false
  	}
  ];
}

module.exports = TeamCtrl;