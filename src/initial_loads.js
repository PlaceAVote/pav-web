var config = require('./config/urls');
(function() {
  function setPreSpinnerWidth(width) {
    var el = document.getElementById('pre-app__progress');
    var w = el.style.width.slice(0, el.style.width.length - 1);
    if (w < width) {
      el.style.width = width + '%';
    }
  }

  function loadPAV() {
    document.body.addEventListener('angularReady', function() {
      setPreSpinnerWidth(100);
      setTimeout(function() {
        var post = document.getElementById('post-app');
        post.style.display = '';
        var pre = document.getElementById('preloading-spinner');
        pre.style.display = 'none';
      }, 1000);
    });
    var app = document.createElement('script');
    app.type = 'text/javascript';
    app.onerror = function() {
      console.log('error');
    };
    app.onload = function() {
      setPreSpinnerWidth(75);
    };
    app.src = config.APPPATH;
    document.body.appendChild(app);
  }

  function loadStyles() {
    var styles = document.createElement('link');
    styles.type = 'text/css';
    styles.rel = 'stylesheet';
    styles.onload = function() {
      setPreSpinnerWidth(50);
    };
    styles.href = '/css/styles.css';
    document.getElementsByTagName('head')[0].appendChild(styles);
  }

  function loadFonts() {
    var fonts = document.createElement('link');
    fonts.type = 'text/css';
    fonts.rel = 'stylesheet';
    fonts.onload = function() {
      setPreSpinnerWidth(35);
    };
    fonts.href = '//cloud.typography.com/6645674/6646752/css/fonts.css';
    document.getElementsByTagName('head')[0].appendChild(fonts);
  }

  function loadThirdParties() {
    var thirdParties = document.createElement('script');
    thirdParties.type = 'text/javascript';
    thirdParties.onerror = function(e) {
      console.log('error', e);
    };
    thirdParties.onload = function() {
      setPreSpinnerWidth(20);
    };
    thirdParties.src = config.THIRDPARTYPATH;
    document.body.appendChild(thirdParties);
  }
  loadPAV();
  loadThirdParties();
  loadStyles();
  loadFonts();
})();
