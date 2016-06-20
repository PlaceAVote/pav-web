var expect = require('chai').expect;
var IssuesController = require('../../src/controllers/issues_controller.js');
var Issue = require('../../src/models/issue.js');

describe('Issues Controller', function() {
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

  it('should push article into attachment array switch off linkAdd setting the open graph data from the server', function() {
    var mockService = {
      getData: function(url, callback) {
        callback(null, {article_title: 'Cute Dog Alert'});
      },
    };
    var subject = new IssuesController(undefined, undefined, undefined, undefined, undefined, mockService);
    var mockArticle = {type:'article',article_link:'www.bbc.co.uk'};
    subject.attach(mockArticle);
    expect(subject.attachments[0].title).to.equal(mockArticle.article_link);
    expect(subject.attachments[0].type).to.equal('Article');
    expect(subject.openData.article_title).to.equal('Cute Dog Alert');
    expect(subject.linkAdd).to.equal(false);
  });

  it('should delete attachment', function() {
    var subject = new IssuesController();
    subject.attachments = [{type: 'bill', title: 'Title'}];
    subject.deleteAttachment(0);
    expect(subject.attachments.length).to.equal(0);
  });

  it('should delete article attachment with og data', function() {
    var subject = new IssuesController();
    subject.openData = { dummy: 'object' };
    subject.issue = {
      article_link: 'www.article.com',
    };
    subject.attachments = [{type: 'Article', title: 'Title'}];
    subject.deleteAttachment(0);
    expect(subject.attachments.length).to.equal(0);
    expect(subject.openData).to.eql(undefined);
    expect(subject.issue.article_link).to.eql(undefined);
  });

  it('should attach link if URL is valid', function() {
    var mockService = {
      getData: function(url, callback) {
        callback(null, {article_title: 'Cute Dog Alert'});
      },
    };
    var subject = new IssuesController(null, null, null, null, null, mockService);
    subject.url = 'http://www.google.com';
    subject.validateUrl();
    expect(subject.attachments[0].title).to.equal(subject.url);
    expect(subject.attachments[0].type).to.equal('Article');
  })

  it('shouldnt add open graph if an error occurs', function() {
    var mockService = {
      getData: function(url, callback) {
        callback(new Error('OG:ERROR'), 'shouldnt set');
      },
    };
    var subject = new IssuesController(null, null, null, null, null, mockService);
    subject.url = 'http://www.google.com';
    subject.validateUrl();
    expect(subject.attachments[0].title).to.equal(subject.url);
    expect(subject.attachments[0].type).to.equal('Article');
    expect(subject.openData).to.eql(undefined);
  })

  it('should return error if link is not a valid URL', function() {
    var subject = new IssuesController(undefined,undefined,undefined,mockTimeout);
    subject.url = 'sogjdsoigjsd';
    subject.validateUrl();
    expect(subject.errorMessage).to.equal('Link entered not valid');
  });
    var mockIssueService = {
      saveIssue: function(issue, callback) {
        callback(undefined, issue);
      }
    };

    var mockIssueServiceError = {
      saveIssue: function(issue, callback) {
        callback(true, undefined);
      }
    };

    var scope = {
      $parent: {
        posted: function() {
          return;
        }
      }
    }

  it('should posts issue without attachments', function() {
    var subject = new IssuesController(scope,undefined,undefined,undefined,mockIssueService);
    subject.issue = new Issue({
      comment: 'Hello World',
    });
    subject.attachments = [];
    subject.postIssue();
    expect(subject.issue).to.be.empty;
    expect(subject.attachments).to.be.empty;
    expect(subject.loading).to.equal(false);
  });

  it('should posts issue with article attachment', function() {
    var subject = new IssuesController(scope,undefined,undefined,undefined,mockIssueService);
    subject.issue = {
      comment: 'Hello World',
    };
    subject.attachments = [{type: 'Article', title: 'http://www.google.com'}];
    subject.postIssue();
    expect(subject.issue).to.be.empty;
    expect(subject.attachments).to.be.empty;
    expect(subject.loading).to.equal(false);
  });

  it('should posts issue with bill attachment', function() {
    var subject = new IssuesController(scope,undefined,undefined,undefined,mockIssueService);
    subject.issue = {
      comment: 'Hello World',
    };
    subject.attachments = [{type: 'Bill', bill_id: 'HR-144'}];
    subject.postIssue();
    expect(subject.issue).to.be.empty;
    expect(subject.attachments).to.be.empty;
    expect(subject.loading).to.equal(false);
  });

  it('should posts issue with article and bill attachments', function() {
    var subject = new IssuesController(scope,undefined,undefined,undefined,mockIssueService);
    subject.issue = {
      comment: 'Hello World',
    };
    subject.attachments = [{type: 'Article', title: 'http://www.google.com'},{type: 'Bill', bill_id: 'HR-144'}];
    subject.postIssue();
    expect(subject.issue).to.be.empty;
    expect(subject.attachments).to.be.empty;
    expect(subject.loading).to.equal(false);
  });

  it('should return error if comment is empty string', function() {
    var subject = new IssuesController(scope,undefined,undefined,mockTimeout,mockIssueServiceError);
    subject.issue = {
      comment: '',
    };
    subject.postIssue();
    expect(subject.errorMessage).to.equal('You need to enter a comment before posting');
  });

  it('should return error if no comment', function() {
    var subject = new IssuesController(scope,undefined,undefined,mockTimeout,mockIssueServiceError);
    subject.issue = {};
    subject.postIssue();
    expect(subject.errorMessage).to.equal('You need to enter a comment before posting');
  });

  it('should return error if service fails', function() {
    var subject = new IssuesController(scope,undefined,undefined,mockTimeout,mockIssueServiceError);
    subject.issue = {
      comment: 'Hello World',
    };
    subject.postIssue();
    expect(subject.loading).to.equal(false)
    expect(subject.errorMessage).to.equal('There was an error when posting your Issue');
  });

});
