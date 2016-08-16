chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

Storage.get({ accessToken: null }).then(function(storage) {
  new Background(new GithubAPI(storage.accessToken));
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

  _runtimeOnConnectHandler.clickOnAutoMergeButton = function({ pathData, clicked }) {
    _githubAPI.getPRData(pathData).then(function(prData) {
      let { merged, mergeable, mergeable_state, statuses_url, updated_at, head, base } = prData;
      let base_ref = base.ref;
      let head_ref = head.ref;
      let storeData = {};

      storeData[pathData.pathname] = JSON.stringify({
        updated_at: +new Date(),
        clicked: clicked,
        merged: merged,
        sha: head.sha,
        base: base_ref,
        head: head_ref
      });

      Storage.set(storeData);

      Worker.performUntil(function(deferred) {
        _githubAPI.getPRStatusData(Object.assign({ ref: head_ref }, pathData))
          .then(function(statusData) {
            console.log('hello', statusData.state );
            // deferred.resolve(statusData.state === 'success');
          });
      })
    });
  }

  init();

  return _this;
}
