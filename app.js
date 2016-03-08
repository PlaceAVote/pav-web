var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.use('/', express.static(__dirname));

app.use(require('prerender-node')).set('prerenderServiceUrl','http://pav-prerender-695693686.us-east-1.elb.amazonaws.com/');

app.listen(port, function() {
  console.log('listening');
});
