var expect = require('chai').expect;
var Google = require('../../src/models/google.js');

describe('Google', function() {
  describe('getContacts', function() {
    it('does not add and contacts to the contacts list on error', function() {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(new Error(''));
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts();
      expect(subject.contacts.length).to.eql(0);
    });

    it('does not add and contacts if feed property doesnt exist', function() {
      var mockApi = {
        loadContacts: function(callback) {
          return callback(null, {});
        },
      };
      var subject = new Google(mockApi);
      subject.getContacts();
      expect(subject.contacts.length).to.eql(0);
    });

    it('adds email address values to the contacts array', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(1);
      expect(subject.contacts[0].email).to.eql('email@address.com');
      expect(subject.contacts[0].name).to.eql('tester name');
    });

    it('wont add if the gd$email is not defined', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(0);
    });

    it('wont add if the gd$email.address is not defined', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(0);
    });

    it('will have a default blank name if title isn\'t defined', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(1);
      expect(subject.contacts[0].email).to.eql('test@testing.com');
      expect(subject.contacts[0].name).to.eql('');
    });

    it('will have a default blank name if title isn\'t defined', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(1);
      expect(subject.contacts[0].email).to.eql('test@testing.com');
      expect(subject.contacts[0].name).to.eql('');
    });

    it('adds email address values to the contacts array but not duplicates within same emailAddresses array', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(2);
      expect(subject.contacts[1].email).to.eql('email@address.com');
      expect(subject.contacts[1].name).to.eql('tester name');
      expect(subject.contacts[0].email).to.eql('email_work@address.com');
      expect(subject.contacts[0].name).to.eql('tester name');
    });

    it('adds email address values to the contacts array but not duplicates within same connections array', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(2);
      expect(subject.contacts[1].email).to.eql('email@address.com');
      expect(subject.contacts[0].email).to.eql('email_work@address.com');
    });

    it('handles both formed and non formed structures in a single call', function() {
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
      subject.getContacts();
      expect(subject.contacts.length).to.eql(3);
      expect(subject.contacts[2].email).to.eql('email@address.com');
      expect(subject.contacts[1].email).to.eql('email_work@address.com');
      expect(subject.contacts[0].email).to.eql('email_noNamek@address.com');
    });
  });
});
