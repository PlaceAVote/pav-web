var BillService = require('../../src/services/bill_service.js');
var Bill = require('../../src/models/bill.js');
var expect = require('chai').expect;

describe("Bill Service", function(){
    var mockResource = {
        get : function(object, onLoad, onError) {
            onLoad([
                {
                "type": "bill",
                "subject": "Health",
                "bill_id": "hr2-114",
                "total_comments": "34",
                "short_title": "Medicare Access and CHIP Reauthorization Act of 2015",
                    "votes": {
                        "yes": 2,
                        "no": 50
                    }
                },
                {
                "type": "bill",
                "subject": "Guns",
                "bill_id": "gu1-123",
                "total_comments": "80",
                "short_title": "Shooting people for the sake of it",
                    "votes": {
                        "yes": 100,
                        "no": 78
                    }
                }
            ]);
         }
    };
    it("Returns a list of bills", function(done){
        var subject = new BillService(mockResource);
        var results = subject.getBills("user", function(err, result){
            expect(err).to.eql(undefined);
            expect(result.length).to.eql(2);
            expect(result[0] instanceof Bill).to.eql(true);
            expect(result[1] instanceof Bill).to.eql(true);
            done();
        });
    });
    it("Returns an error", function(done){
        mockResource.get = function(object, onLoad, onError) {
            onError({message: "Error"});
        };
        var subject = new BillService(mockResource);
        var results = subject.getBills("user", function(err, result){
            expect(err).to.eql({message: "Error"});
            expect(result).to.eql(undefined);
            done();
        });
    });
});
