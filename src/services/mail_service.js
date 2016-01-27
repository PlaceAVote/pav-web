var config = require('../config/endpoints.js');

function MailService($resource) {

  var sendMail = function(mailData, callback) {
    if (!mailData) {
      return callback('Mail data should be given');
    }

    var onLoad = function(res) {
      if (res[0].status === 'sent') {
        callback(undefined, res);
      } else {
        callback(res);
      }
    };

    var onError = function(err) {
      return callback(err);
    };

    var url = config.mandrill.endpoint;
    request = new $resource(url, undefined, {send: config.methods.postArray});

    var data = {
      key: config.mandrillKey,
      message: {
        text: mailData.body,
        subject: 'Contact',
        from_email: mailData.email,
        from_name: mailData.name,
        to: [
          {
            email: 'hello@placeavote.com',
            name: 'Place a vote',
            type: 'to',
          },
        ],
        headers: {
          'Reply-To': mailData.email,
        },
      },
    };

    request.send(data, onLoad, onError);
  };

  return {
    sendMail: sendMail,
  };
}

module.exports = MailService;
