var expect = require("chai").expect;
var config = require("../../src/config/endpoints.js");
var live_config = require("../../src/config/live_endpoints.js");


describe("Configs", function() {
    describe("User Config", function() {
        it("all properties of users endpoints (bar endpoint) should be the same", function() {
            expect(config.users.create).to.eql(live_config.users.create);
        });
        it("should have the same add user token functionality", function(){
            config.users.addUserToken('AAAAA');
            live_config.users.addUserToken('AAAAA');
            expect(config.users.create.headers['PAV-USER-AUTH']).to.eql(live_config.users.create.headers['PAV-USER-AUTH']);
        });

    });
});
