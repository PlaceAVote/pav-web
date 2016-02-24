var AWS = require('aws-sdk');
var uuid = require('uuid');

var awsOptions = {region: 'us-east-1'};
var client = new AWS.CloudFront(awsOptions);

var config = require('./config.js');
var arg = process.argv[process.argv.length -1];

function updateDistribution(dist, done) {
  console.log('Updating Distribution', dist.Id);
  configParams = {
    Id: dist.Id, /* required */
  };
  client.getDistributionConfig(configParams, function(err, config) {
    if (err) {
      done(err);
      return;
    }

    viewCert = {
      ACMCertificateArn: config.certAtn,
      SSLSupportMethod: 'sni-only',
      MinimumProtocolVersion: 'SSLv3'
    };
    config.ViewerCertificate = viewCert;
    config.DefaultCacheBehavior.Compress = true;
    config.CallerReference = uuid.v4();
    config.Id = dist.Id;
    config.IfMatch = config.ETag;
    delete config.ETag;
    client.updateDistribution(config, function(err, result) {
      if (err) {
        done(err);
        return;
      }
      var invalidateParams = {
        DistributionId: dist.Id,
        InvalidationBatch: {
          CallerReference: uuid.v4(),
          Paths: {
            Quantity: 1,
            Items: ['/*'],
          },
        },
      };
      console.log('Invalidating Cache');
      client.createInvalidation(invalidateParams, function(err, data) {
        if (err) {
          done(err);
          return;
        }
        console.log(data);
        done();
      });
    });

  });
}

function isDistributionToUpdate(dist) {
  if (!dist || !dist.DefaultCacheBehavior || !dist.DefaultCacheBehavior.TargetOriginId) {
    return false;
  }
  var target = dist.DefaultCacheBehavior.TargetOriginId;
  if (target.includes(arg)) {
    console.log(arg);
    return true;
  }
  return false;
}

function patch(done) {
  client.listDistributions({}, function(err, result) {
    if (err) {
      done(err);
      return;
    }
    var update;
    for(var i=0, len = result.Items.length; i < len; i++) {
      var dist = result.Items[i];
      if (isDistributionToUpdate(dist)) {
        update = dist;
      }
    }
    if (!update) {
      done();
      return;
    }
    var params = {
      Id: update.Id,
    };
    client.waitFor('distributionDeployed', params, function(err, data) {
      if (err) {
        done(err);
        return;
      }
      updateDistribution(dist, done);
    });
  });
}

patch(function(err){
  if (err) {
    console.log('ERROR: ', err);
    return;
  }
  console.log('Distribution Completing');
});
