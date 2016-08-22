let Main = (function(window, $, AutoMergeButtonInjecter, LocationRecognizer) {
  let _port = null;
  let _runtimeOnConnectHandler = {};
  let _this = {
    pathname: window.location.pathname
  };

  function init() {
    console.log('Main#init');
    _this.autoMergeButtonInjecter = new AutoMergeButtonInjecter();

    $(window.document).on('pjax:end', _this.render);

    _port = chrome.runtime.connect({ name: 'git-automerge' });
    _port.onMessage.addListener(function (response, port) {
      let handler = _runtimeOnConnectHandler[response.message];
      typeof handler === 'function' && handler(response.data, port);
    });

    _this.render();
  }

  _this.render = function() {
    console.log('Main#render');
    let pathData = new LocationRecognizer(_this.pathname).identifyAs();

    if (pathData.isPage('SinglePullRequest')) {
      _port.postMessage({
        message: 'loadAutoMergeButtonStatus',
        data: { pathData }
      });
    }
  }

  _runtimeOnConnectHandler.loadAutoMergeButtonStatusCompleted = function({ pathData, recordExists }) {
    _this.autoMergeButtonInjecter.inject(function() {
      let newClickState = !_this.autoMergeButtonInjecter.clicked;

      _this.autoMergeButtonInjecter.setState(newClickState);

      if (newClickState){
        _port.postMessage({
          message: 'createAutoMerge',
          data: { pathData }
        });
      } else {
        _port.postMessage({
          message: 'cancelAutoMerge',
          data: { pathData }
        });
      }
    });

    _this.autoMergeButtonInjecter.setState(recordExists);
  }

  init();

  return _this;
})(window, jQuery, AutoMergeButtonInjecter, LocationRecognizer);