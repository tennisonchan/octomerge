'use strict';

var LinearPort = function () {
  var _this = {},
      _ports = {},
      _tabIds = [];

  function port(index) {
    var tabId = index || _tabIds[0];
    return _ports[tabId];
  }

  _this.port = function (index) {
    return port(index);
  };

  _this.addPort = function (port) {
    console.log('post.tabId: ', _this.getTabId(port));
    if (_tabIds.indexOf(_this.getTabId(port)) === -1) {
      _tabIds.push(_this.getTabId(port));
    }

    _ports[_this.getTabId(port)] = port;

    return port;
  };

  _this.removePort = function (tabId) {
    tabId = tabId || _tabIds.shift();
    delete _ports[tabId];
  };

  _this.getTabId = function (_port) {
    if ((_port || port() || {}).sender) {
      return (_port || port()).sender.tab.id;
    }

    return null;
  };

  _this.postMessage = function (payload) {
    console.log('post.tabId: ', _this.getTabId());

    _tabIds.length && port().postMessage(payload);
  };

  return _this;
}();