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
      Storage.get(_this.pathname).then(function(storage) {
        let data = JSON.parse(storage[_this.pathname]) || {};

        _this.autoMergeButtonInjecter.inject(function(e) {
          let newClickState = !_this.autoMergeButtonInjecter.clicked;

          _this.autoMergeButtonInjecter.setState(newClickState);

          _port.postMessage({
            message: 'clickOnAutoMergeButton',
            data: { pathData, clicked: newClickState }
          });
        });

        _this.autoMergeButtonInjecter.setState(data.clicked);
      });
    }
  }

  init();

  return _this;
})(window, jQuery, AutoMergeButtonInjecter, LocationRecognizer);