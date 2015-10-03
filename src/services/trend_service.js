var Bill = require("../models/bill.js");
var Comment = require("../models/comment.js");
function TrendService(resource){
  var getTrends = function(callback){
    var onLoad = function(result){
      for(var i = 0; i < result.length; i++){
        switch(result[i].type){
          case "bill":
            result[i] = new Bill(result[i]);
            break;
          case "comment":
            result[i] = new Comment(result[i]);
            break;
        }
      }
      callback(undefined, result);
    };
    var onError = function(err){
      callback(err);
    };
    resource.get(undefined, onLoad, onError);
  }
  return {
    getTrends: getTrends
  };
};

module.exports = TrendService;
