var expect = require('chai').expect;
var service = require('../../src/services/general_service.js');

describe('GenericService', function(){

  it('instantiates a resource with correct params', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: {
        id: 1004,
      },
    };

    var actualParams = {};
    function mockResource(url, param, method){
      actualParams.url = url;
      actualParams.param = param;
      actualParams.method = method;
    }
    mockResource.prototype.getById = function(object, onLoad, onError){done();};

    var config = {
      methods: {
        get: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: false,
        },
      },
      legislator: {
        getById: {
          endpoint: function(properties) {
            return 'www.test.com/' + properties.id;
          },
          properties: ['id'],
        },
      },
    }
    var serve = service(mockResource, config);

    serve.get(options, function(err, response) {
      expect(actualParams.url).to.eql('www.test.com/1004');
      expect(actualParams.param).to.eql(null);
      expect(actualParams.method.getById.method).to.eql('GET');
      done();
    });
  });

  it('calls on error when a server returns an error', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: {
        id: 1004,
      },
    };

    var actualParams = {};
    function mockResource(url, param, method){
      actualParams.url = url;
      actualParams.param = param;
      actualParams.method = method;
    }
    mockResource.prototype.getById = function(object, onLoad, onError){
      onError('ERROR');
      return;
    };

    var config = {
      methods: {
        get: { },
      },
      legislator: {
        getById: {
          endpoint: function(properties) {
            return 'www.test.com/' + properties.id;
          },
          properties: ['id'],
        },
      },
    }
    var serve = service(mockResource, config);

    serve.get(options, function(err, response) {
      expect(err).to.eql('ERROR');
      done();
    });
  });

  it('returns a raw response from server', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: {
        id: 1004,
      },
    };

    var actualParams = {};
    function mockResource(url, param, method){
      actualParams.url = url;
      actualParams.param = param;
      actualParams.method = method;
    }
    mockResource.prototype.getById = function(object, onLoad, onError){
      onLoad({id: 1, name: 'keith'});
      return;
    };

    var config = {
      methods: {
        get: { },
      },
      legislator: {
        getById: {
          endpoint: function(properties) {
            return 'www.test.com/' + properties.id;
          },
          properties: ['id'],
        },
      },
    }
    var serve = service(mockResource, config);

    serve.get(options, function(err, response) {
      expect(err).to.eql(null);
      expect(response.id).to.eql(1);
      expect(response.name).to.eql('keith');
      done();
    });
  });

  it('returns a transformed object from server', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: {
        id: 1004,
      },
      transformer: function(object) {
        object.transformed = true;
        return object;
      }
    };

    var actualParams = {};
    function mockResource(url, param, method){
      actualParams.url = url;
      actualParams.param = param;
      actualParams.method = method;
    }
    mockResource.prototype.getById = function(object, onLoad, onError){
      onLoad({id: 1, name: 'keith'});
      return;
    };

    var config = {
      methods: {
        get: { },
      },
      legislator: {
        getById: {
          endpoint: function(properties) {
            return 'www.test.com/' + properties.id;
          },
          properties: ['id'],
        },
      },
    }
    var serve = service(mockResource, config);

    serve.get(options, function(err, response) {
      expect(err).to.eql(null);
      expect(response.id).to.eql(1);
      expect(response.name).to.eql('keith');
      expect(response.transformed).to.eql(true);
      done();
    });
  });

  it('returns an error if no spec is defined in options', function(done) {
    var options =  {};
    var config = {};
    var mockResource = {};
    var serve = service(mockResource, config);
    serve.get(options, function(err, response) {
      expect(err.message).to.eql('spec not defined');
      done();
    });
  });

  it('returns an error if no properties are defined', function(done) {
    var options =  { spec: {id: '1'}};
    var config = {};
    var mockResource = {};
    var serve = service(mockResource, config);
    serve.get(options, function(err, response) {
      expect(err.message).to.eql('properties not defined');
      done();
    });
  });

  it('returns an error if path to properties cant be found', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: {
        id: 1004,
      },
    };

    var config = {
      methods: { },
    }
    var mockResource = {};
    var serve = service(mockResource, config);
    serve.get(options, function(err, response) {
      expect(err.message).to.eql('Cannot read property \'getById\' of undefined');
      done();
    });
  });

  it('returns an error if no spec can be found in config', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: {
        id: 1004,
      },
    };

    var config = {
      methods: { },
      legislator: {
        getById: {
          endpoint: function(id) {},
        },
      },
    }
    var mockResource = {};
    var serve = service(mockResource, config);
    serve.get(options, function(err, response) {
      expect(err.message).to.eql('resource method not defined in config');
      done();
    });
  });

  it('returns an error if item is require but not defined in options properties', function(done) {
    var options =  {
      spec: {
        type: 'get',
        method: 'getById',
        resource: 'legislator',
      },
      properties: { },
    };

    var config = {
      methods: { },
      legislator: {
        getById: {
          endpoint: function(id) {},
          properties: ['id'],
        },
      },
    }
    var mockResource = {};
    var serve = service(mockResource, config);
    serve.get(options, function(err, response) {
      expect(err.message).to.eql('a required property is not included in the options properties');
      done();
    });
  });
});
