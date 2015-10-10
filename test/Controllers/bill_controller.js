var expect = require('chai').expect;
var BillController = require('../../src/controllers/bill_controller.js');

describe('BillController', function(){
  it('gets id from url', function(){
    var routeParams = {
      id: '100'
    };
    var billController = new BillController(undefined, routeParams);
    expect(billController.id).to.eql('100');
  });
  it('assigns this to scope.bill', function(){
    var scope = {};
    var routeParams = {
      id: '100'
    };
    var billController = new BillController(scope, routeParams);
    expect(scope.bill.id).to.eql('100');
  });
});

