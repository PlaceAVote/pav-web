var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var prerenderToken = 'XfWVDqvFXsFXTL8ngxB1';

app.use(require('prerender-node').set('prerenderToken', prerenderToken).set('protocol', 'https'));

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));

function secure(req, res) {
  if (!req.sequre) {
    console.log('redirecting');
    return res.redirect('https://' + req.headers.host + req.url);
  }
  res.sendFile('index.html', { root: __dirname + '/' });
}

app.all('/*', secure);

app.listen(port, function() {
  console.log('listening on ' + port);
});
