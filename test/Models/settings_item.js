var SettingsItem = require("../../src/models/settings_item.js");
var expect = require("chai").expect;

describe("SettingsItem", function(){
    it("toBody returns an object with string type dob", function(){
        var settingsItem = new SettingsItem();

        settingsItem.email = "stefan@test.com";
        settingsItem.first_name = "stefan";
        settingsItem.last_name = "huber";
        settingsItem.dob = new Date("12/12/1989");
        settingsItem.gender = "male";
        settingsItem.city = "Berlin";
        settingsItem.img_url = "image.com";
        settingsItem.public = false;
        settingsItem.social_login = true;
        
        var subject = settingsItem.toBody();
        var expected = {
            email: "stefan@test.com",
            first_name: "stefan",
            last_name: "huber",
            gender: "male",
            dob: "12/12/1989",
            public: false,
            city: "Berlin"
        };
        expect(subject).to.eql(expected);
    });
});
