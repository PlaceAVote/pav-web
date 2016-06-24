(function() {
  function setPreSpinnerWidth(width) {
    var el = document.getElementById('pre-app__progress');
    var w = el.style.width.slice(0, el.style.width.length - 1);
    console.log('current width', w);
    console.log('try to set width', width);
    if (w < width) {
      console.log('setting width to', width);
      el.style.width = width + '%';
    }
  }

  function loadPAV() {
    console.log('runing loading');
    document.body.addEventListener('angularReady', function() {
      console.log('angular ready');
      setPreSpinnerWidth(100);
      setTimeout(function() {
        console.log('remove');
        var post = document.getElementById('post-app');
        post.style.display = '';
        var pre = document.getElementById('preloading-spinner');
        pre.style.display = 'none';
      }, 3000);
    });
    var app = document.createElement('script');
    app.type = 'text/javascript';
    app.onerror = function() {
      console.log('error');
    };
    app.onload = function() {
      console.log('loaded script app');
      setPreSpinnerWidth(75);
    };
    app.src = 'dist/js/app-min.js';
    document.body.appendChild(app);
  }

  function loadStyles() {
    console.log('runing style');
    var styles = document.createElement('link');
    styles.type = 'text/css';
    styles.rel = 'stylesheet';
    styles.onload = function() {
      console.log('loaded styles');
      setPreSpinnerWidth(50);
    };
    styles.href = '/css/styles.css';
    document.getElementsByTagName('head')[0].appendChild(styles);
  }

  function loadFonts() {
    console.log('runing font');
    var fonts = document.createElement('link');
    fonts.type = 'text/css';
    fonts.rel = 'stylesheet';
    fonts.onload = function() {
      console.log('loaded fonts');
      setPreSpinnerWidth(35);
    };
    fonts.href = '//cloud.typography.com/6645674/6646752/css/fonts.css';
    document.getElementsByTagName('head')[0].appendChild(fonts);
  }

  function loadThirdParties() {
    console.log('runing tp');
    var thirdParties = document.createElement('script');
    thirdParties.type = 'text/javascript';
    thirdParties.onerror = function(e) {
      console.log('error', e);
    };
    thirdParties.onload = function() {
      console.log('loaded tp');
      setPreSpinnerWidth(20);
    };
    thirdParties.src = 'src/third_party_scripts.js';
    document.body.appendChild(thirdParties);
  }
  loadPAV();
  loadThirdParties();
  loadStyles();
  loadFonts();
})();
