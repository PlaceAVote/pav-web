var express = require('express');
var logger = require('morgan');
var port = process.env.PORT || 3000;
var app = express();
var prerenderToken = 'XfWVDqvFXsFXTL8ngxB1';

app.use(logger('combined'));
app.use(require('prerender-node').set('prerenderToken', prerenderToken).set('protocol', 'https'));

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));
app.use('/font', express.static(__dirname + '/font'));

app.use('*', express.static(__dirname));

app.listen(port, function() {
  console.log('listening on ' + port);
});
