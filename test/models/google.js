var expect = require('chai').expect;
var Google = require('../../src/models/google.js');

describe('Google', function() {
  describe('getContacts', function() {
    it('does not add and contacts to the contacts list on error', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(new Error('Nope'));
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, response) {
        expect(err.message).to.eql('Nope');
        done();
      });
    });

    it('does not add and contacts if feed property doesnt exist', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {});
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, contacts) {
        expect(err.message).to.eql('No Feed Item Returned');
        done();
      });
    });

    it('adds email address values to the contacts array', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {
                      address: 'email@address.com',
                    },
                  ],
                  title: {
                   $t: 'tester name',
                  },
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, contacts) {
        expect(contacts.length).to.eql(1);
        expect(contacts[0].email).to.eql('email@address.com');
        expect(contacts[0].name).to.eql('tester name');
        done();
      });
    });

    it('wont add if the gd$email is not defined', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  title: {
                   $t: 'tester name',
                  },
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, contacts) {
        expect(contacts.length).to.eql(0);
        done();
      });
    });

    it('wont add if the gd$email.address is not defined', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {},
                  ],
                  title: {
                   $t: 'tester name',
                  },
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(er, contacts) {
        expect(contacts.length).to.eql(0);
        done();
      });
    });

    it('will have a default blank name if title isn\'t defined', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {
                      address: 'test@testing.com'
                    },
                  ],
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, contacts) {
        expect(contacts.length).to.eql(1);
        expect(contacts[0].email).to.eql('test@testing.com');
        expect(contacts[0].name).to.eql('');
        done();
      });
    });

    it('will have a default blank name if title isn\'t defined', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {
                      address: 'test@testing.com'
                    },
                  ],
                  title: {}
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, contacts) {
        expect(contacts.length).to.eql(1);
        expect(contacts[0].email).to.eql('test@testing.com');
        expect(contacts[0].name).to.eql('');
        done();
      });
    });

    it('adds email address values to the contacts array but not duplicates within same emailAddresses array', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {
                      address: 'email@address.com',
                    },
                    {
                      address: 'email@address.com',
                    },
                    {
                      address: 'email_work@address.com',
                    },
                  ],
                  title: {
                   $t: 'tester name',
                  },
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(e, contacts) {
        expect(contacts.length).to.eql(2);
        expect(contacts[1].email).to.eql('email@address.com');
        expect(contacts[1].name).to.eql('tester name');
        expect(contacts[0].email).to.eql('email_work@address.com');
        expect(contacts[0].name).to.eql('tester name');
        done();
      });
    });

    it('adds email address values to the contacts array but not duplicates within same connections array', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {
                      address: 'email@address.com',
                    },
                  ],
                  title: {
                   $t: 'tester name',
                  },
                },
                {
                  gd$email: [
                    {
                      address: 'email@address.com',
                    },
                  ],
                  title: {
                   $t: 'tester name',
                  },
                },
                {
                  gd$email: [
                    {
                      address: 'email_work@address.com',
                    },
                  ],
                  title: {
                   $t: 'tester name',
                  },
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(er, contacts) {
        expect(contacts.length).to.eql(2);
        expect(contacts[1].email).to.eql('email@address.com');
        expect(contacts[0].email).to.eql('email_work@address.com');
        done();
      });
    });

    it('handles both formed and non formed structures in a single call', function(done) {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {
            feed: {
              entry: [
                {
                  gd$email: [
                    {
                      address: 'email@address.com',
                    },
                  ],
                  title: {
                   $t: 'should be inclueded 1',
                  },
                },
                {
                  gd$email: [],
                  title: {
                   $t: 'tester name',
                  },
                },
                {
                  gd$email: [
                    {
                      address: 'email_work@address.com',
                    },
                  ],
                  title: {
                   $t: 'should be included 2',
                  },
                },
                {
                  gd$email: [
                    {
                      address: 'email_noNamek@address.com',
                    },
                  ],
                },
              ],
            },
          });
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts(function(err, contacts) {
        expect(contacts.length).to.eql(3);
        expect(contacts[2].email).to.eql('email@address.com');
        expect(contacts[1].email).to.eql('email_work@address.com');
        expect(contacts[0].email).to.eql('email_noNamek@address.com');
        done();
      });
    });
  });
});
