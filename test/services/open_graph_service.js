var expect = require('chai').expect;
var openGraphService = require('../../src/services/open_graph_service.js');

describe('Open Graph Service', function() {
  describe('getData', function() {
    it('returns an error when a url is not defined', function(done) {
      var service = openGraphService();
      service.getData(undefined, function(err, result) {
        expect(err.message).to.eql('No URL defined');
        done();
      });
    });

    it('calls request with correct params', function(done) {
      var actualUrl;
      var actualParams;
      var actualMethod;
      var mockRequest = function(url, params, method) {
        actualUrl = url;
        actualParams = params;
        actualMethod = method;
        return {
          data: function(body, onLoad) {
            return onLoad({
              article_link: 'http://www.hello.com',
              article_img: 'http://www.hello.com/image.gif',
              article_title: 'HELLO WORLD'
            });
          },
        };
      };
      var service = openGraphService(mockRequest);
      service.getData('http://www.hello.com', function(err, result) {
        expect(err).to.eql(null);
        expect(result.article_link).to.eql('http://www.hello.com');
        expect(result.article_img).to.eql('http://www.hello.com/image.gif');
        expect(result.article_title).to.eql('HELLO WORLD');
        expect(actualUrl).to.contain('opengraph/scrape');
        expect(actualParams).to.eql(undefined);
        expect(actualMethod.data.method).to.eql('GET');
        done();
      });
    });

    it('returns an error from the server', function(done) {
      var mockRequest = function(url, params, method) {
        return {
          data: function(body, onLoad, onError) {
            onError(new Error('Server Error'));
          },
        };
      };
      var service = openGraphService(mockRequest);
      service.getData('http://www.hello.com', function(err, result) {
        expect(err.message).to.eql('Server Error');
        done();
      });
    });
  });
});
