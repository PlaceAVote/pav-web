var ExampleIssue = require('../models/issue.js');
module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      posted: '&',
    },
    templateUrl: 'partials/directives/issues_post.html',
    link: function(scope, el, attr) {
      scope.example = false;
      scope.textarea = el[0].getElementsByClassName('post-message');
      scope.$watchCollection('textarea', function(n) {
        if (n[0]) {
          n[0].onfocus = function(e) {
            scope.dirty = true;
            scope.$apply();
          };
          n[0].onblur = function(e) {
            if (n[0].value === '') {
              scope.dirty = false;
              scope.$apply();
            }
          };
        }
      });

      scope.showExample = function() {
        if (scope.example) {
          scope.example = false;
        } else {
          scope.example = true;
        }
      };

      scope.theExample = true;
      var example = {
        issue_id: '1234',
        bill_id: 's2344-114',
        bill_title: 'Liberty Through Strength Act II',
        comment: 'Something is fundementally wrong with having to give up more personal freedoms every time someone commits an act of terrorism. Thats exactly the reaction there looking for.',
        article_link: 'http://thehill.com/policy/national-security/260445-cotton-aims-to-block-nsa-reforms-at-11th-hour-after-paris-attack',
        article_title: 'Sen. Cotton pushes to delay NSA reforms in wake of Paris attack',
        article_img: 'http://thehill.com/sites/default/files/blogs/cottontom_020515gn.jpg',
        img_url: 'https://cdn.placeavote.com/users/f661f34e-f53e-45e4-b591-74d652245a6a/profile/img/p200xp200x/b8c9ddb8-17c3-417a-a663-1c626ef079c6.jpeg',
        first_name: 'John',
        last_name: 'Ervine',
        emotional_response: 'negative',
        negative_responses: 209,
        neutral_responses: 4,
        positive_responses: 1,
        author_id: 'f661f34e-f53e-45e4-b591-74d652245a6a',
      };

      scope.exampleIssue = new ExampleIssue(example);
      scope.exampleIssue.type = 'example';

    },
  };
};
