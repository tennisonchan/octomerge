let Main = (function(window, $, moment, AutoMergeButtonInjecter, StatusMessageInjecter, LoginButtonInjecter, LocationRecognizer, Storage) {
  let _port = null;
  let _runtimeOnConnectHandler = {};
  let _this = {
    deleteBranchAfterMergedClass: '.post-merge-message button[type=submit]',
    mutationTarget: 'partial-pull-merging',
    completenessIndicatorErrorOrSuccessClass: '.branch-action-item.js-details-container .completeness-indicator-error, .branch-action-item.js-details-container .completeness-indicator-success',
    deleteBranchMessage: 'Octomerge detects there is an unused branch can be deleted.\n\nDo you want to auto-delete these branches for you in the future? (You can always restore the deleted branches)'
  };

  function init(storage) {
    _this.autoDeleteBranches = storage.autoDeleteBranches;
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
      _this.performAutoDeleteBranches();

      _port.postMessage({
        message: 'loadAutoMergeButtonStatus',
        data: { pathData }
      });
    }
  }

  _this.performAutoDeleteBranches = function() {
    if (!$(_this.deleteBranchAfterMergedClass).length) { return false; }

    if (_this.autoDeleteBranches === null) {
      _this.autoDeleteBranches = confirm(_this.deleteBranchMessage);
      Storage.set({ autoDeleteBranches: _this.autoDeleteBranches });
    }

    _this.autoDeleteBranches && $(_this.deleteBranchAfterMergedClass).click();
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
      obs.observe( el, { childList: true, subtree: true });
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

    // if(_this.isCompletenessIndicatorErrorOrSuccess()) { return false; }

    _this.autoMergeButtonInjecter.inject(function(e) {
      let { autoMerged, confirmed } = _this.autoMergeButtonInjecter;

      if (!autoMerged && !confirmed) {
        _this.autoMergeButtonInjecter.injectConfirmButton(function() {
          _this.autoMergeButtonInjecter.confirmed = true;

          _this.autoMergeButtonInjecter.setState({ confirmed: !confirmed, isOwner: true });
          _this.statusMessageInjecter.inject('last-try', { lastUpdated: new Date(), toShow: !confirmed });
          _port.postMessage({
            message: 'createAutoMerge',
            data: { pathData,
              commit_title: $('#merge_title_field').val(),
              commit_message: $('#merge_message_field').val()
            }
          });
        });
      } else {
        if (confirmed){
          _port.postMessage({
            message: 'cancelAutoMerge',
            data: { pathData }
          });
          _this.statusMessageInjecter.inject('last-try', { toShow: false });
          _this.autoMergeButtonInjecter.setState({ confirmed: false, isOwner: true });
          e.stopPropagation();
        }
      }
    });

    _this.autoMergeButtonInjecter.setState({ confirmed: recordExists, isOwner, autoMergeBy });
    _this.statusMessageInjecter.inject('last-try', {
      lastUpdated,
      toShow: recordExists
    });
  }

  _runtimeOnConnectHandler.requestLogin = function() {
    _this.loginButtonInjecter.inject(function() {
      window.open(`${ENV.HOST}/users/sign_in?iframe=0`);
    });
  }

  Storage.get({
    autoDeleteBranches: null
  }).then(function(storage) {
    init(storage);
  })

  return _this;
})(window, jQuery, moment, AutoMergeButtonInjecter, StatusMessageInjecter, LoginButtonInjecter, LocationRecognizer, Storage);
