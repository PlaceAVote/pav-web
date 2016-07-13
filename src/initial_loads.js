var config = require('./config/urls');
(function() {
  var rotation = 360;
  function spin() {
    var els = document.getElementsByClassName('pre-app__spinner--logo');
    var el = els[0];
    // If there's no el the page has loaded, stop recursive call.
    if (!el) {
      return;
    }
    var rot = 'rotate(' + rotation + 'deg)';
    el.style.transform = rot;
    el.style['-webkit-transition'] = rot;
    rotation += 360;
    setTimeout(spin, 2500);
  }

  var sayings = ['Loading democracy...', 'Installing representation...', 'Taking back congress...'];
  var sayingIndex = 0;
  var sayContinue = true;

  function populateText(word) {
    var preText = document.getElementById('pre-text');
    if (!preText) {
      return;
    }
    preText.innerHTML = word;
  }

  function speak() {
    // The app is loaded and we can stop now.
    if (!sayContinue) {
      populateText('Democracy Loaded.');
      return;
    }
    // If we've already been round the loop
    // continue to do so by starting again.
    if (sayingIndex > sayings.length - 1) {
      sayingIndex = 0;
    }
    populateText(sayings[sayingIndex]);
    sayingIndex++;
    setTimeout(speak, 2500);
  }

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
      sayContinue = false;
      speak();
      setTimeout(function() {
        var post = document.getElementById('post-app');
        post.style.display = '';
        var pre = document.getElementById('preloading-spinner');
        document.body.removeChild(pre);
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
      setTimeout(speak, 100);
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
  // Delay inital spin.
  setTimeout(spin, 2500);
})();
