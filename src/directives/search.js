module.exports = function() {
	return {
		restrict: 'E',
		scope: {
			results: '=',
			query: '&'
		},
		templateUrl: 'partials/directives/search.html',
		link: function(scope, el, attr) {
			var query;
			el[0].onkeyup = function(e) {
				console.log(e);
				q = el[0].children[0].value;
				if(q.length < 4) {
					scope.results = [];
				}
				if(q.length > 4) {
					scope.query({q: q});
				}
			}

			scope.$watchCollection('results', function(n, o) {
				console.log('new', n);
				console.log('old', o);
			});
		}
	};
}

//Navigate through results with arrow keys
//Preloader
//Text highlight
//Dynamic ordering in terms relevance