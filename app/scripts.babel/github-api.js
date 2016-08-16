class GithubAPI {
  constructor(accessToken) {
    this.baseUrl = 'https://api.github.com';
    this.accessToken = accessToken || null;
  }

  _checkAccessTokenAbsence() {
    return this.accessToken == null;
  }

  _callAPI(url, options) {
    if (this._checkAccessTokenAbsence()) return $.Deferred().reject();
    options = options || {};

    return $.ajax(url, options);
  }

  getPRData({ owner, repo, prNumber }) {
    let url = `${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}?access_token=${this.accessToken}`;

    return this._callAPI(url);
  }

  getCommentsData({ owner, repo, prNumber }) {
    let url = `${this.baseUrl}/repos/${owner}/${repo}/issues/${prNumber}/comments?access_token=${this.accessToken}`;

    return this._callAPI(url);
  }

  getPRStatusData({ owner, repo, ref }) {
    // "https://api.github.com/repos/alphasights/pistachio/statuses/5b9c1ad2166607d1723c6954b0ab90fe8f1df64b"
    let url = `${this.baseUrl}/repos/${owner}/${repo}/commits/${ref}/status?access_token=${this.accessToken}`;

    return this._callAPI(url);
  }

  performMerge({ owner, repo, sha }, data) {
    // /repos/:owner/:repo/merges
    let url = `${this.baseUrl}/repos/${owner}/${repo}/merges?access_token=${this.accessToken}`;

    // data = {
    //   base: 'master', // base.ref
    //   head: 'cool_feature', // head.ref
    //   commit_message: 'Shipped cool_feature!'
    // }

    return this._callAPI(url, {
      method: 'POST',
      data: data,
    });
  }
}
