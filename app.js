var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var urls = require('./src/config/urls.js');

app.use('/', express.static(__dirname));

app.use(require('prerender-node').set('prerenderServiceUrl', urls.PRERENDER));

app.listen(port, function() {
  console.log('listening on ' + port, 'prerender running: ' + urls.PRERENDER);
});
