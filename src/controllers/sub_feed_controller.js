'use strict';

function SubFeedController(dependencies) {
  var options = dependencies || {};
  this.name = options.name;
  this.items = options.items || [];
  this.count = this.items.length;
  this.categories = this.initCategories(options);
}

SubFeedController.prototype.initCategories = function(options) {
  var categories = {};
  if (!options.categories) {
    return categories;
  }
  for (var i = 0, len = options.categories.length; i < len; i ++) {
    var category = options.categories[i];
    if (!category.name) {
      continue;
    }
    categories[category.name] = category;
  }
  return categories;
};

SubFeedController.prototype.update = function(items) {
  this.items = this.items.concat(items);
  this.count = this.items.length;
};

module.exports = SubFeedController;
