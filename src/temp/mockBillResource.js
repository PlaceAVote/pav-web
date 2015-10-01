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
        "subject": "Guns",
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
    }
    return {
        get: get
    }
};

module.exports = TempBillResource;
