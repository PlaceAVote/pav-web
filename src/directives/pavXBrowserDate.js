module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      date: '=',
      min: '=',
      max: '=',
    },
    templateUrl: function() {
      // BIT OF A HACK...
      // If the browser can support html 5 date time use
      // that template.
      var e = document.createElement('input');
      e.setAttribute('type', 'date');
      if (e.type !== 'date') {
        return 'partials/directives/date_old.html';
      }
      return 'partials/directives/date.html';
    },
  };
};
