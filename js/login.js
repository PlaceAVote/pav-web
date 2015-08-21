$( document ).ready(function() {
    console.log( "ready!" );

    $('.email-login').on('click', function() {
    	$('.vanish').toggleClass('visible');
    })

	$( "form" ).on( "submit", function( event ) {
	  event.preventDefault();
	  // console.log( $( this ).serialize() );
	  // var loginData = $( this ).serialize();
	  var loginUrl = "https://pav-user-api-1042958048.us-west-2.elb.amazonaws.com:8443/user";
	  	
	  $.ajax({
	  		type: "PUT",
	  		url: loginUrl,
	  		data: {"email":"anthony@place.com", "password" : "stuff"},
	  		dataType: "json",
	  		crossDomain: true,
	  		headers: {"Content-Type": "application/json", "Accept": "application/json", "Access-Control-Allow-Origin":"*"},
	  		success: function(data) {
	  			console.log('success');
	  			console.log(data);
	  		},
	  		error: function(data) {
	  			console.log('error');
	  			console.log(data);
	  		}
	  });
//


	});


});








