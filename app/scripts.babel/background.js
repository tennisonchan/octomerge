chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

var Background = function(githubAPI) {
  let _this = {};

  function init() {
    // githubAPI.getCommentsData('alphasights', 'pistachio', '5380').then(function() {
    //   debugger;
    // });
  }

  init();

  return _this;
}

Storage.get({ accessToken: null }).then(function(storage) {
  new Background(new GithubAPI(storage.accessToken));
});
