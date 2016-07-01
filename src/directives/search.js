var searchBarDirective = function($sce, $location) {
  return {
    restrict: 'E',
    scope: {
      results: '<',
      query: '&',
      focus: '=',
      searching: '<',
      placeholder: '@',
      attachBill: '&',
    },
    templateUrl: 'partials/directives/search.html',
    link: function(scope, el, attr) {
      if (attr.$attr.people) {
        scope.people = true;
      }
      if (attr.$attr.bills) {
        scope.bills = true;
      }
      if (attr.$attr.issues) {
        scope.issues = true;
      }
      var q;
      var selected;
      var cachedQuery;
      scope.location = $location;
      el[0].onmouseleave = function(e) {
        scope.results = [];
        scope.$apply();
        return;
      };
      el[0].children[0].onkeyup = function(e) {
        if (e.which == 13 && scope.results.constructor !== Array && selected && selected.type == 'bill' && !scope.issues) {
          selected.goToBill($location, selected.bill_id);
          scope.results = [];
          scope.$apply();
          return;
        }

        if (e.which == 13 && scope.results.constructor !== Array && selected && selected.type == 'users') {
          selected.goToProfile($location, selected.user_id);
          scope.results = [];
          scope.$apply();
          return;
        }

        if (e.which == 40 || e.which == 38) {
          return selectResult(e.which, document.getElementById('bill-results'),document.getElementById('user-results'),
              function(s) {
                selected = s;
              });
        }

        if (e.which == 27) {
          scope.results = [];
          scope.$apply();
          return;
        }
        q = $sce.valueOf(el[0].children[0].value);
        if (q.length < 3) {
          scope.results = [];
          scope.$apply();
        }
        if (q.length > 3) {
          scope.query({q: q});
          scope.$apply();
          return;
        }

        if (q.length && e.which == 13) {
          cachedQuery = q;
          scope.query({q: q});
          scope.$apply();
          return;
        }
      }; // End of keyup function

      scope.$watchCollection('results', function(n, o) {
        if (n === undefined) {
          return;
        }

        if (n.length === 0) {
          return;
        }

        if (n) {
          if (n != scope.results) {
            scope.results = n;
            scope.$apply();
          }
          if (n.users.length > 0) {
            matchText('users');
          }
          if (n.bills.length > 0) {
            matchText('bills');
          }
        }

      });

      var matchText = function(obj) {
        if (scope.results[obj]) {
          if (scope.results[obj].length > 0) {
            for (var i in scope.results[obj]) {
              boldMatch(q, scope.results[obj][i]);
            }
          }
        }
      }; // End of match text

      var boldMatch = function(q, text) {
        var str, match;
        str = new RegExp(q, 'i');
        match = text.full_title.match(str);
        if (match) {
          if (text.html.length === undefined) {
            return;
          }
          text.html = $sce.trustAsHtml(text.html.replace(str, '<span class="text-select">' + match[0] + '</span>'));
        }

      }; // End of Bold Match

      var selectResult = function(keyEvent, b, u, c) {
        if (!scope.results.bills && !scope.results.users) {
          return;
        }

        for (var i = 0; i < b.children.length; i++) {
          if (scope.results.bills[i].selected) {
            scope.results.bills[i].selected = false;
            i = keyEvent === 40 ? i + 1 : i - 1;
            if (i == -1 && scope.results.users.length > 0) {
              i = scope.results.users.length - 1;
              scope.results.users[i].selected = true;
              scope.$apply();
              return c(scope.results.users[i]);
            }
            if (i == -1 && scope.results.users.length === 0) {
              i = scope.results.bills.length - 1;
              scope.results.bills[i].selected = true;
              scope.$apply();
              return c(scope.results.bills[i]);
            }
            if (!scope.results.bills[i] && scope.results.users.length > 0) {
              scope.results.users[0].selected = true;
              scope.$apply();
              return c(scope.results.users[0]);
            }
            if (!scope.results.bills[i] && scope.results.users.length === 0) {
              scope.results.bills[0].selected = true;
              scope.$apply();
              return c(scope.results.bills[0]);
            }
            scope.results.bills[i].selected = true;
            scope.$apply();
            return c(scope.results.bills[i]);
          }

        }


        for (i = 0; i < u.children.length; i++) {
          if (scope.results.users[i].selected) {
            scope.results.users[i].selected = false;
            i = keyEvent == 40 ? i + 1 : i - 1;
            if (i == -1 && scope.results.bills.length > 0) {
              i = scope.results.bills.length - 1;
              scope.results.bills[i].selected = true;
              scope.$apply();
              return c(scope.results.bills[i]);
            }
            if (i == -1 && scope.results.bills.length === 0) {
              i = scope.results.users.length - 1;
              scope.results.users[i].selected = true;
              scope.$apply();
              return c(scope.results.users[i]);
            }
            if (!scope.results.users[i] && scope.results.bills.length > 0) {
              scope.results.bills[0].selected = true;
              scope.$apply();
              return c(scope.results.bills[0]);
            }
            if (!scope.results.users[i] && scope.results.bills.length === 0) {
              scope.results.users[0].selected = true;
              scope.$apply();
              return c(scope.results.users[0]);
            }
            scope.results.users[i].selected = true;
            scope.$apply();
            return c(scope.results.users[i]);
          }
        }

        if (scope.results.bills && scope.results.users.length === 0) {
          scope.results.bills[0].selected = true;
          scope.$apply();
          return c(scope.results.bills[0]);
        }

        if (scope.results.users && scope.results.bills.length === 0) {
          scope.results.users[0].selected = true;
          scope.$apply();
          return c(scope.results.users[0]);
        }
        scope.results.bills[0].selected = true;
        scope.$apply();
        return c(scope.results.bills[0]);

      }; // End of resultSelector

      scope.clearItems = function() {
        scope.results = [];
      };

      el[0].children[0].onfocus = function(e) {
        scope.focus = true;
        scope.$apply();
        return;
      };

      el[0].children[0].onblur = function(e) {
        scope.focus = false;
        scope.$apply();
        return;
      };

      el[0].children[0].onmouseover = function(e) {
        q = el[0].children[0].value;
        if (q.length > 3 || cachedQuery === q) {
          scope.query({q: q});
          scope.$apply();
          return;
        }
      };

      scope.attach = function(bill) {
        scope.attachBill({bill: bill});
        return;
      };
    },
  };
};
module.exports = searchBarDirective;
