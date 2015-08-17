$( document ).ready(function() {
    console.log( "ready!" );

    $('.email-login').on('click', function() {
    	$('.vanish').toggleClass('visible');
    });

	// $( "form" ).on( "submit", function( event ) {
	//   event.preventDefault();
	//   console.log( $( this ).serialize() );
	//   var loginData = $( this ).serialize();
	//   var loginUrl = "http://pav-user-api-1996773369.us-east-1.elb.amazonaws.com:8080/user/authenticate";
	  	
	//   $.ajax({
	//   		type: "POST",
	//   		url: loginUrl,
	//   		data: {"email":"tony@place.com", "password" : "stuff"},
	//   		dataType: "json",
	//   		crossDomain: true,
	//   		headers: {"Content-Type": "application/json", "Accept": "application/json"},
	//   		beforeSend: function (xhr) {
 //            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
 //       		 },
	//   		success: function(data) {
	//   			console.log('success');
	//   			console.log(data);
	//   		},
	//   		error: function(data) {
	//   			console.log('error');
	//   			console.log(data);
	//   		}
	//   });


	// });


});








