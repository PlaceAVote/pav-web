var expect = require('chai').expect;
var BillController = require('../../src/controllers/bill_controller.js');
var Bill = require('../../src/models/bill.js');
var Comment = require('../../src/models/comment.js');
var Legislator = require('../../src/models/legislator.js');

describe('BillController', function(){
  var scope = {};
  var routeParams = {
    id: '100'
  };
  it('gets id from url', function(){
    var mockBillService = {
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComment: function(id, callback){
        callback(undefined, 'comment');
      },
    };
    var billController = new BillController(undefined, routeParams, mockBillService);
    expect(billController.id).to.eql('100');
  });
  it('assigns this to scope.bill', function(){
    var mockBillService = {
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComment: function(id, callback){
        callback(undefined, 'comment');
      },
    };
    var mockLegislationService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService);
    expect(scope.bill.id).to.eql('100');
  });
  it('sets scope.body to result of BillService callback', function(done){
    var bill = new Bill({
      id: 10,
      sponsor: {
        thomas_id: '99'
      },
    });
    var mockBillService = {
      getBill: function(id, callback){
        callback(undefined, bill);
      },
      getTopComment: function(id, callback){
        callback(undefined, 'comment');
      },
    };
    var mockLegislationService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService);
    billController.getBill('100');
    expect(scope.bill.body).to.eql(bill);
    done();
  });
  it('sets scope.error to true if callback has error', function(done){
    var mockBillService = {
      getBill: function(id, callback){
        callback('Error');
      },
      getTopComment: function(id, callback){
        callback(undefined, 'comment');
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService);
    billController.getBill('100');
    expect(scope.bill.error).to.eql(true);
    done();
  });
  describe('Get Comment For Bill', function(){
    it('sets topComment attribute', function(done){
      var comment = new Comment({
        id: 10,
      });
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComment: function(id, callback){
          callback(undefined, comment);
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService);
      billController.getTopComment('100');
      expect(scope.bill.topComment).to.eql(comment);
      done();
    });
    it('set topCommentError to be true when server returns error', function(done){
      var comment = new Comment({
        id: 10,
      });
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComment: function(id, callback){
          callback('Error');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService);
      billController.getTopComment('100');
      expect(scope.bill.topComment).to.eql(undefined);
      expect(scope.bill.topCommentError).to.eql(true);
      done();
    });
  });
  describe('Get Legislator', function(){
    it('set legislator from returned service result', function(){
      var legislationJSON = require('../fixtures/legislator.js');
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComment: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback(undefined, new Legislator(legislationJSON));
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService) ;
      billController.getLegislator({thomas_id: '10'});
      expect(scope.bill.legislator.properties).to.eql(legislationJSON);
    });
    it('set legislation error to true is service returns error', function(){
      var mockBillService = {
        getBill: function(id, callback){
          callback('Error');
        },
        getTopComment: function(id, callback){
          callback('Error');
        },
      };
      var mockLegislationService = {
        getById: function(id, callback){
          callback('Error');
        },
      };
      var billController = new BillController(scope, routeParams, mockBillService, mockLegislationService) ;
      billController.getLegislator({thomas_id: '10'});
      expect(scope.bill.legislator).to.eql(undefined);
      expect(scope.bill.legislatorError).to.eql(true);
    });
  });
});

