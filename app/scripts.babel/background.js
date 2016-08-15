'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

console.log('\'Allo \'Allo! Event Page');

var Background = function() {
  let _this = {
    accessToken: null
  };

  function init() {
    _this.loadAccessToken().then(function() {
      $.ajax('https://api.github.com/repos/alphasights/pistachio/issues/5380/comments?access_token='+_this.accessToken)
      .then(function(comments) {
        debugger;
      })
    });
  }

  _this.loadAccessToken = function() {
    return Storage.get({ accessToken: null }).then(function(storage) {
      _this.accessToken = storage.accessToken;
    });
  };

  init();

  return _this;
}

new Background();
