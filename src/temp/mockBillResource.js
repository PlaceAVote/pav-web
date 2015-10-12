function TempBillResource(){
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
        },
        "summary": "a bill about medicare access and chip reauthorization"
                },
                {
                    "type": "bill",
        "subject": "Religion",
        "bill_id": "gu1-123",
        "total_comments": "80",
        "short_title": "Shooting people for the sake of it",
        "votes": {
            "yes": 100,
            "no": 78
        },
        "summary": "a bill about medicare access and chip reauthorization"
                },
            {
                    "type": "bill",
        "subject": "Economics",
        "bill_id": "gu1-123",
        "total_comments": "80",
        "short_title": "Shooting people for the sake of it",
        "votes": {
            "yes": 100,
            "no": 78
        },
        "summary": "a bill about medicare access and chip reauthorization"
                },
                {
                    "type": "bill",
        "subject": "Defense",
        "bill_id": "gu1-123",
        "total_comments": "80",
        "short_title": "Shooting people for the sake of it",
        "votes": {
            "yes": 100,
            "no": 78
        },
        "summary": "a bill about medicare access and chip reauthorization"
                },
                {
                    "type": "bill",
        "subject": "Gun Rights",
        "bill_id": "gu1-123",
        "total_comments": "80",
        "short_title": "Shooting people for the sake of it",
        "votes": {
            "yes": 100,
            "no": 78
        },
        "summary": "a bill about medicare access and chip reauthorization"
                },
                {
                    "type": "bill",
        "subject": "Technology",
        "bill_id": "gu1-123",
        "total_comments": "80",
        "short_title": "Shooting people for the sake of it",
        "votes": {
            "yes": 100,
            "no": 78
        },
        "summary": "a bill about medicare access and chip reauthorization"
                },
                {
                    "type": "bill",
        "subject": "Social Interest",
        "bill_id": "gu1-123",
        "total_comments": "80",
        "short_title": "Shooting people for the sake of it",
        "votes": {
            "yes": 100,
            "no": 78
        },
        "summary": "a bill about medicare access and chip reauthorization"
                }
        ]);
    };

    var getTopComment = function(params, onLoad, onError){
      onLoad(
      {
        "type": "comment",
        "user_name": "Paul Barber",
        "comment": "this is a comment blah ablah blash",
        "replies": 80,
        "subject": "Guns",
        "upvotes": 100,
      }
      );
    };

    return {
        get: get,
        getTopComment: getTopComment,
    };
}

module.exports = TempBillResource;
