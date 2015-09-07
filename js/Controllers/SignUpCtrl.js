var SignUpCtrl = function($scope, $location, countryCodes) {

	var signup = this;

	signup.max = signup.maxDate();

 	signup.user = { 
	 	"password": "",
	  	"email": "",
	  	"first_name": "",
	   	"last_name": "",
	  	"dob": "",
	 	"country_code": "840"
	}
	
	countryCodes.success(function(data) { 
	signup.country = data;
	});

	signup.test = function() {
		console.log(
			signup.user
			);
	}

}

	SignUpCtrl.prototype.maxDate = function() {
			var d = new Date();
			var y = d.getFullYear();
			d.setFullYear(y-18);
			var year = d.getFullYear();
			var month = d.getMonth();
			var day = d.getDay();
			month += 1;
			if(month<=9) 

			{
				month = '0' + month.toString();
			}

			else 

			{
				
				month = month.toString();	

			}
			
		    if(day<=9) 
		    
		    {
		    	
		    	day = '0' + day.toString();
	    	} 

	    	else 

	    	{
		    	day = day.toString();
		    	
		    }

		    year = year.toString();
			return year + "-" + month + "-" + day;
		}



	SignUpCtrl.$inject = ['$scope', '$location', 'countryCodes'];

	app.controller('SignUpCtrl', SignUpCtrl);


