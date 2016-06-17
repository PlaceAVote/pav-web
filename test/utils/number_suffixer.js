var expect = require('chai').expect;
var numberSuffixer = require('../../src/utils/number_suffixer.js');

describe('Number Suffixer', function() {
  it('Returns 0 values with th suffix', function() {
    var values = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('0th')).to.eql(true);
    }
  });
  it('Returns 1 values with st suffix', function() {
    var values = [1, 21, 31, 41, 51, 61, 71, 81, 91, 101];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('1st')).to.eql(true);
    }
  });
  it('Returns 2 values with nd suffix', function() {
    var values = [2, 22, 32, 42, 52, 62, 72, 82, 92, 102];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('2nd')).to.eql(true);
    }
  });
  it('Returns 3 values with rd suffix', function() {
    var values = [3, 23, 33, 43, 53, 63, 73, 83, 93, 103];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('3rd')).to.eql(true);
    }
  });
  it('Returns 4 values with th suffix', function() {
    var values = [4, 14, 24, 34, 44, 54, 64, 74, 84, 94, 104];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('4th')).to.eql(true);
    }
  });
  it('Returns 5 values with th suffix', function() {
    var values = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('5th')).to.eql(true);
    }
  });
  it('Returns 6 values with th suffix', function() {
    var values = [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('6th')).to.eql(true);
    }
  });
  it('Returns 7 values with th suffix', function() {
    var values = [7, 17, 27, 37, 47, 57, 67, 77, 87, 97, 107];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('7th')).to.eql(true);
    }
  });
  it('Returns 8 values with th suffix', function() {
    var values = [8, 18, 28, 38, 48, 58, 68, 78, 88, 98, 108];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('8th')).to.eql(true);
    }
  });
  it('Returns 9 values with th suffix', function() {
    var values = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 109];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('9th')).to.eql(true);
    }
  });
  it('handles 11, 111, 1011 to be th', function() {
    var values = [11, 111, 1011];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('1th')).to.eql(true);
    }
  })
  it('handles 12, 112, 1012 to be th', function() {
    var values = [12, 112, 1012];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('2th')).to.eql(true);
    }
  })
  it('handles 13, 113, 1013 to be th', function() {
    var values = [12, 112, 1012];
    for(var i = 0; i < values.length; i++) {
      var result = numberSuffixer(values[i]);
      expect(result.endsWith('2th')).to.eql(true);
    }
  })
});
