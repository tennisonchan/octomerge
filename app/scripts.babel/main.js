let githubAPI = null;

class Main {
  constructor() {
    console.log('Main init');
    this.autoMergeInjecter = new AutoMergeInjecter();

    this.render();

    $(document).on('pjax:end', this.render.bind(this));
  }

  render() {
    console.log('render');
    let pathData = new LocationRecognizer(window.location.pathname).identifyAs();

    if (pathData.isPage('SinglePullRequest')) {

      githubAPI.getPRData(pathData).then((prData) => {
        let { mergeable, mergeable_state, statuses_url } = prData;

        this.autoMergeInjecter.inject();
      })
    }
  }
}

Storage.get({ accessToken: null }).then(function(storage) {
  githubAPI = new GithubAPI(storage.accessToken);

  new Main();
});
