class LocationRecognizer {
  constructor(pathname) {
    let pathnameArray = pathname.split('/');

    this.pathData = Object.assign({ pathname: pathname },
      this.isSinglePullRequestPage(pathnameArray) ||
      this.isPersonalPullRequestsPage(pathnameArray) ||
      this.isPullRequestListPage(pathnameArray) ||
      this.isPullRequestListAuthorPage(pathnameArray) || {}
    );
  }

  identifyAs() {
    return Object.assign(this.pathData, {
      isPage: (pagename) => {
        return pagename === this.pathData.page;
      }
    });
  }

  isSinglePullRequestPage(array = []) {
    if (array[3] !== 'pull' || array.length !== 5) { return false; }
    // /:owner/:repo/pull/:number

    return {
      page: 'SinglePullRequest',
      owner: array[1],
      repo: array[2],
      pr_number: array[4]
    }
  }

  isPersonalPullRequestsPage(array = []) {
    if (array[1] !== 'pulls' || array.length !== 2) { return false; }
    // /pulls

    return {
      page: 'PersonalPullRequests'
    }
  }

  isPullRequestListPage(array = []) {
    if (array[3] !== 'pulls' || array.length !== 4) { return false; }
    // /:owner/:repo/pulls

    return {
      page: 'PullRequestList',
      owner: array[1],
      repo: array[2]
    }
  }

  isPullRequestListAuthorPage(array = []) {
    if (array[3] !== 'pulls' || array.length !== 5) { return false; }
    // /:owner/:repo/pulls/:author

    return {
      pathname: pathname.split('/').slice(0, -1).join('/'),
      page: 'PullRequestListAuthor',
      owner: array[1],
      repo: array[2],
      author: array[4],
    }
  }
}