var expect = require("chai").expect;
var config = require("../../src/config/endpoints.js");
var live_config = require("../../src/config/live_endpoints.js");


describe("Configs", function() {
    describe("User Config", function() {
        it("all properties of users endpoints (bar endpoint) should be the same", function() {
            expect(config.users.create).to.eql(live_config.users.create);
        });
        it("all login should be the some", function() {
            expect(config.users.login).to.eql(live_config.users.login);
        })
        it("user should have a create_endpoint", function(){
            expect(!!config.users.endpoint).to.eql(true);
            expect(!!live_config.users.endpoint).to.eql(true);
        });
        it("users should have a login endpoint", function(){
            expect(!!config.users.login_endpoint).to.eql(true);
            expect(!!live_config.users.login_endpoint).to.eql(true);
        })
    });
});
