var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var prerenderToken = 'XfWVDqvFXsFXTL8ngxB1';

app.use(require('prerender-node').set('prerenderToken', prerenderToken).set('protocol', 'https'));

app.use('/', express.static(__dirname));

app.listen(port, function() {
  console.log('listening on ' + port, 'prerender running:', prerenderToken);
});
