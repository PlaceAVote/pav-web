var expect = require('chai').expect;
var BillController = require('../../src/controllers/bill_controller.js');
var Bill = require('../../src/models/bill.js');

describe('BillController', function(){
  var scope = {};
  var routeParams = {
    id: '100'
  };
  it('gets id from url', function(){
    var mockBillService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var billController = new BillController(undefined, routeParams, mockBillService);
    expect(billController.id).to.eql('100');
  });
  it('assigns this to scope.bill', function(){
    var mockBillService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService);
    expect(scope.bill.id).to.eql('100');
  });
  it('sets scope.body to result of BillService callback', function(done){
    var bill = new Bill({
      id: 10,
    });
    var mockBillService = {
      getById: function(id, callback){
        callback(undefined, bill);
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService);
    billController.getBill('100');
    expect(scope.bill.body).to.eql(bill);
    done();
  });
  it('sets scope.error to true if callback has error', function(done){
    var mockBillService = {
      getById: function(id, callback){
        callback('Error');
      },
    };
    var billController = new BillController(scope, routeParams, mockBillService);
    billController.getBill('100');
    expect(scope.bill.error).to.eql(true);
    done();
  });
});

