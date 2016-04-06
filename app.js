var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var urls = require('./src/config/urls.js');

app.use(require('prerender-node').set('prerenderServiceUrl', urls.PRERENDER).set('protocol', 'https'));

app.use('/', express.static(__dirname));

app.listen(port, function() {
  console.log('listening on ' + port, 'prerender running: ' + urls.PRERENDER);
});
