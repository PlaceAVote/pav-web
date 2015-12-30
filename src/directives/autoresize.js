module.exports = function() {

	return {
		restrict: 'A',
		link: function( scope, el, attr ) {
				var txt = el[0];
				var $scrollHeight = txt.scrollHeight;
				var $newLine = txt.value.split('\n').length;
				txt.onkeyup = function(e) {
				 	if($scrollHeight < txt.scrollHeight || $newLine < txt.value.split('\n').length) {	
				 		el[0].rows++;
				 		$scrollHeight = txt.scrollHeight;
				 		$newLine = txt.value.split('\n').length;
				 		return;
				 	}
				}

				txt.onblur = function() {
					setTimeout(function(){
						if(txt.value.length == 0) {
							el[0].rows = 1;
						}
					}, 500)
				}
		}
	}
};