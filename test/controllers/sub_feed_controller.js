var expect = require('chai').expect;
var SubFeedController = require('../../src/controllers/sub_feed_controller.js');

describe('sub feed', function() {
  it('can take null options', function() {
    var sub = new SubFeedController(null);
    expect(sub.name).to.eql(undefined);
  });
  it('has a name to be set', function() {
    var options = {
      name: 'test',
    };
    var sub = new SubFeedController(options);
    expect(sub.name).to.eql('test');
  });
  it('has inital count', function() {
    var sub = new SubFeedController();
    expect(sub.count).to.eql(0);
  });
  it('can be instantiated with items', function() {
    var items = ['a', 'b', 'c'];
    var sub = new SubFeedController({items: items});
    expect(sub.items).to.eql(items);
    expect(sub.count).to.eql(3);
  });
  it('can have sub catergories', function() {
    var sub = new SubFeedController({name: 'Discovery', categories: [new SubFeedController({name: 'Technology'})]});
    expect(sub.categories.Technology.name).to.eql('Technology');
  });
  it('doesnt include subs without names', function() {
    var sub = new SubFeedController({name: 'Discovery', categories: [new SubFeedController({name: 'Technology'}), new SubFeedController()]});
    expect(sub.categories.Technology.name).to.eql('Technology');
    expect(sub.categories.undefined).to.eql(undefined);
  });
  it('update will not override the existing items', function() {
    var items = ['a', 'b', 'c'];
    var sub = new SubFeedController({items: items});
    sub.update(['d', 'e', 'f']);
    expect(sub.items[0]).to.eql('a');
    expect(sub.items[5]).to.eql('f');
    expect(sub.items.length).to.eql(6);
    expect(sub.count).to.eql(6);
  });
});
