var express = require('express');
var port = process.env.PORT || 8080;
var app = express();

app.use('/', express.static(__dirname));

app.use(require('prerender-node').set('prerenderServiceUrl', 'https://prerenderdev.placeavote.com'));

app.listen(port, function() {
  console.log('listening on ' + port);
});
