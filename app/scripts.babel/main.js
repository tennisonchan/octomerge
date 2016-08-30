let Main = (function(window, $, moment, AutoMergeButtonInjecter, StatusMessageInjecter, LoginButtonInjecter, LocationRecognizer) {
  let _port = null;
  let _runtimeOnConnectHandler = {};
  let _this = {
    mutationTarget: 'partial-pull-merging',
    completenessIndicatorErrorOrSuccessClass: '.branch-action-item.js-details-container .completeness-indicator-error, .branch-action-item.js-details-container .completeness-indicator-success'
  };

  function init() {
    _this.autoMergeButtonInjecter = new AutoMergeButtonInjecter();
    _this.loginButtonInjecter = new LoginButtonInjecter();
    _this.statusMessageInjecter = new StatusMessageInjecter();

    _port = chrome.runtime.connect({ name: 'git-octomerge' });
    _port.onMessage.addListener(function(response, port) {
      let handler = _runtimeOnConnectHandler[response.message];
      typeof handler === 'function' && handler(response.data, port);
    });

    _this.render();

    $(window.document).on('pjax:end', _this.render);
    observeDOM(window.document, _this.render);
  }

  _this.isCompletenessIndicatorErrorOrSuccess = function() {
    return !!$(_this.completenessIndicatorErrorOrSuccessClass).length;
  }

  _this.render = function() {
    let pathData = new LocationRecognizer(window.location.pathname).identifyAs();

    if (pathData.isPage('SinglePullRequest')) {
      if ($('.post-merge-message button[type=submit]').length) {
        $('.post-merge-message button[type=submit]').click();
      } else {
        _port.postMessage({
          message: 'loadAutoMergeButtonStatus',
          data: { pathData }
        });
      }
    }
  }

  function observeDOM(el, callback) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      eventListenerSupported = window.addEventListener;

    if(MutationObserver){
      var obs = new MutationObserver(function(mutations, observer){
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.id === _this.mutationTarget) {
              callback(mutation);
            }
          });
        });
      });
      obs.observe( el, { childList:true, subtree:true });
    }
    else if(eventListenerSupported){
      el.addEventListener('DOMNodeInserted', callback, false);
      el.addEventListener('DOMNodeRemoved', callback, false);
    }
    else {
      console.error('Both MutationObserver and eventListenerSupported are not supported.');
    }
  }

  _runtimeOnConnectHandler.loadAutoMergeButtonStatusCompleted = function(data) {
    let { autoMergeBy, pathData, lastUpdated, recordExists, isOwner } = data;

    if(_this.isCompletenessIndicatorErrorOrSuccess()) { return false; }

    _this.autoMergeButtonInjecter.inject(function() {
      let newClickState = !_this.autoMergeButtonInjecter.clicked;
      _this.autoMergeButtonInjecter.setState({ clicked: newClickState, isOwner: true });
      _this.statusMessageInjecter.inject('last-try', {
        lastUpdated: new Date(),
        toShow: newClickState
      });

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

    _this.autoMergeButtonInjecter.setState({ clicked: recordExists, isOwner, autoMergeBy });
    _this.statusMessageInjecter.inject('last-try', {
      lastUpdated,
      toShow: recordExists
    });
  }

  _runtimeOnConnectHandler.requestLogin = function() {
    _this.loginButtonInjecter.inject(function() {
      window.open(ENV.HOST);
    });
  }

  init();

  return _this;
})(window, jQuery, moment, AutoMergeButtonInjecter, StatusMessageInjecter, LoginButtonInjecter, LocationRecognizer);
