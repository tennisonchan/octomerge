class GithubAPI {
  constructor(accessToken) {
    this.baseUrl = 'https://api.github.com';
    this.accessToken = accessToken || null;
  }

  _checkAccessTokenAbsence() {
    return this.accessToken == null;
  }

  _callAPI(url) {
    if (this._checkAccessTokenAbsence()) return false;

    return $.ajax(url);
  }

  getPRData({ owner, repo, prNumber }) {
    let url = `${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}?access_token=${this.accessToken}`;

    return this._callAPI(url);
  }

  getCommentsData({ owner, repo, prNumber }) {
    let url = `${this.baseUrl}/repos/${owner}/${repo}/issues/${prNumber}/comments?access_token=${this.accessToken}`;

    return this._callAPI(url);
  }

  getPRStatusData({ owner, repo, sha }) {
    // "https://api.github.com/repos/alphasights/pistachio/statuses/5b9c1ad2166607d1723c6954b0ab90fe8f1df64b"
    let url = `${this.baseUrl}/repos/${owner}/${repo}/commits/${sha}/status?access_token=${this.accessToken}`;

    return this._callAPI(url);
  }
}
