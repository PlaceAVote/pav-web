module.exports = function() {

	return {

		restrict: 'A',
		link: function( scope, el, attr ) {
				var txt = el[0];
				txt.onkeyup = function(e) {
				 	el[0].rows = txt.value.split('\n').length;
				}

		}
	}
};