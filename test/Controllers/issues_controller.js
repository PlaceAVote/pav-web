var expect = require('chai').expect;
var IssuesController = require('../../src/controllers/issues_controller.js');

describe('Issues Controller', function() {
  //ToggleSearch
  var mockTimeout = function(func) {
    return func;
  }

  it('should switch search on', function() {
    var subject = new IssuesController();
    subject.attachments = [];
    subject.billSearch = false;
    subject.toggleSearch();
    expect(subject.billSearch).to.equal(true);
  });

  it('should prevent stop toggle if Bill attachment already exsits and returns error message', function() {
    var subject = new IssuesController(undefined,undefined,undefined,mockTimeout);
    subject.attachments = [{type: 'Bill'}]
    subject.billSearch = false;
    subject.toggleSearch();
    expect(subject.billSearch).to.equal(false);
    expect(subject.errorMessage).to.equal('Bill already attached');
  });

  it('should switch search off if already open', function() {
    var subject = new IssuesController();
    subject.attachments = [];
    subject.billSearch = true;
    subject.toggleSearch();
    expect(subject.billSearch).to.equal(false);
  });

  it('should switch linkAdd off if already open', function() {
    var subject = new IssuesController();
    subject.attachments = [];
    subject.linkAdd = true;
    subject.toggleLink();
    expect(subject.linkAdd).to.equal(false);
  });

  it('should switch link add on', function() {
    var subject = new IssuesController();
    subject.attachments = [];
    subject.linkAdd = false;
    subject.toggleLink();
    expect(subject.linkAdd).to.equal(true);
  });

  it('should prevent stop toggle if Link attachment already exsits and returns error message', function() {
    var subject = new IssuesController(undefined,undefined,undefined,mockTimeout);
    subject.attachments = [{type: 'Article'}]
    subject.linkAdd = false;
    subject.toggleLink();
    expect(subject.linkAdd).to.equal(false);
    expect(subject.errorMessage).to.equal('Article already attached');
  });

  it('should switch Link Add off if already open', function() {
    var subject = new IssuesController();
    subject.attachments = [];
    subject.linkAdd = true;
    subject.toggleLink();
    expect(subject.linkAdd).to.equal(false);
  });

  it('should switch billSearch off if already open', function() {
    var subject = new IssuesController();
    subject.attachments = [];
    subject.billSeach = true;
    subject.toggleLink();
    expect(subject.billSearch).to.equal(false);
  });
  
  it('should return error message passed to it', function() {
    var subject = new IssuesController(undefined,undefined,undefined,mockTimeout);
    var error = 'This is a test error';
    subject.setError(error);
    expect(subject.errorMessage).to.equal(error);
  });

  it('should push bill into attachment array switch off billSearch', function() {
    var subject = new IssuesController();
    var mockBill = {type:'bill',short_title:'A title'};
    subject.attach(mockBill);
    expect(subject.attachments[0].title).to.equal(mockBill.short_title);
    expect(subject.attachments[0].type).to.equal('Bill');
    expect(subject.billSearch).to.equal(false);
  });

  it('should push article into attachment array switch off linkAdd', function() {
    var subject = new IssuesController();
    var mockArticle = {type:'article',article_link:'www.bbc.co.uk'};
    subject.attach(mockArticle);
    expect(subject.attachments[0].title).to.equal(mockArticle.article_link);
    expect(subject.attachments[0].type).to.equal('Article');
    expect(subject.linkAdd).to.equal(false);
  });
  
  it('should delete attachment', function() {
    var subject = new IssuesController();
    subject.attachments = [{type: 'bill', title: 'Title'}];
    subject.deleteAttachment(0);
    expect(subject.attachments.length).to.equal(0);
  });
  
  it('should attach link if URL is valid', function() {
    var subject = new IssuesController();
    subject.url = 'http://www.google.com';
    subject.validateUrl();
    expect(subject.attachments[0].title).to.equal(subject.url);
    expect(subject.attachments[0].type).to.equal('Article');
  })

  it('should return error if link is not a valid URL', function() {
    var subject = new IssuesController(undefined,undefined,undefined,mockTimeout);
    subject.url = 'sogjdsoigjsd';
    subject.validateUrl();
    expect(subject.errorMessage).to.equal('Link entered not valid');
  });
  //ValidateUrl
});
