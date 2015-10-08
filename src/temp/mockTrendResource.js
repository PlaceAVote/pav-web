function TempTrendResource(){
  var get = function(object, onLoad, onError) {
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
        "type": "comment",
        "user_name": "Paul Barber",
        "comment": "this is a comment blah ablah blash",
        "replies": 80,
        "subject": "Guns",
        "upvotes": 100,
      }
    ]);
  };
  return {
    get: get
  };
}

module.exports = TempTrendResource;
