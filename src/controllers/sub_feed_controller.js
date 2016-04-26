'use strict';

/**
 * A Generic Controller to be used by the Feedcontroller
 *
 */
function SubFeedController(dependencies) {
  var options = dependencies || {};
  this.name = options.name;
  this.title = options.title;
  this.items = options.items || [];
  this.count = this.items.length;
  this.categories = this.initCategories(options);
  this.showCategories = false;
}

/**
 * Given an initial catergory collection create a map.
 */
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

/**
 * Replace all current items in the items list
 * and update the count accordingly.
 */
SubFeedController.prototype.update = function(items) {
  if (!items) {
    return;
  }
  this.items = items;
  this.count = items.length;
};

/**
 * Push these items into the current items list,
 * appending to the list and updating the count.
 */
SubFeedController.prototype.push = function(items) {
  if (!items) {
    return;
  }
  this.items = this.items.concat(items);
  this.count += items.length;
};

/**
 * Given a list and filter param.  Only add items to the list that have the
 * 'type' property equivilant given in the filter.
 */
SubFeedController.prototype.filter = function(items, filters) {
  if (!items || items.length === 0 || !filters || filters.length === 0) {
    return;
  }
  var filt = items.filter(function(item) {
    var passed = false;
    filters.forEach(function(filter) {
      if (item.type === filter) {
        passed = true;
      }
    });
    return passed;
  });
  this.push(filt);
};

module.exports = SubFeedController;
