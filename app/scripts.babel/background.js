chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);

  Storage.get({ accessToken: null }).then(function(storage) {
    new Background(new GithubAPI(storage.accessToken));
  });
});


function Background(_githubAPI) {
  let _this = {};
  let _runtimeOnConnectHandler = {};

  function init() {
    chrome.runtime.onConnect.addListener(function(port) {
      LinearPort.addPort(port).onMessage.addListener(function(response, _port) {
        let handler = _runtimeOnConnectHandler[response.message];
        typeof handler === 'function' && handler(response.data, _port);
      });
    });
  }

  _runtimeOnConnectHandler.loadAutoMergeButtonStatus = function({ pathData }, _port) {
    $.ajax(`${ENV.HOST}/auto_merges/${pathData.pr_number}.json`, {
      dataType: 'json'
    })
    .then(function(data){
      data = data || {};

      _port.postMessage({
        message: 'loadAutoMergeButtonStatusCompleted',
        data: {
          pathData: pathData,
          lastUpdated: data.last_updated,
          recordExists: !!(data.pr_number && data.status !== 'closed')
        }
      });
    })
    .fail(function(deferred, type, errorType) {
      if (errorType === 'Unauthorized') {
        _port.postMessage({
          message: 'requestLogin',
          data: {}
        });
      }
    });
  }

  _runtimeOnConnectHandler.createAutoMerge = function({ pathData }) {
    $.ajax(`${ENV.HOST}/auto_merges`, {
      type: 'POST',
      dataType: 'json',
      data: { pathData }
    });
  }

  _runtimeOnConnectHandler.cancelAutoMerge = function({ pathData }) {
    $.ajax(`${ENV.HOST}/auto_merges/${pathData.pr_number}`, {
      type: 'DELETE'
    });
  }

  init();

  return _this;
}
