/* jQuery Promise based wrappers around the chrome.local.storage API*/
var Storage = (function($, window, chrome){
  var _this = {},
      storageArea = chrome.storage.sync,
      onchangeHandlers = {},
      runtime = chrome.runtime;

  function initialize() {
    chrome.storage.onChanged.addListener(function(changes) {
      for(var variable in changes) {
        var payload = {};
        var handler = onchangeHandlers[variable];
        payload[variable] = changes[variable].newValue;
        handler && handler(payload);
      }
    });
  }

  _this.onchange = function(selectors, callback) {
    selectors.forEach(function(selector) {
      onchangeHandlers[selector] = callback;
    });
  };

  _this.set = function (data) {
    var deferred = new $.Deferred();

    storageArea.set(data, function(){
      if(runtime.lastError){
        console.error('Error ocurred when setting value');
        defferred.reject(data, runtime.lastError);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise();
  };

  _this.get = function (key) {
    var deferred = new $.Deferred();

    storageArea.get(key, function(data){
      if(runtime.lastError){
        console.error('Error ocurred when getting value');
        deferred.reject(key, runtime.lastError);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise();
  };

  _this.update = function(key, updateFunc, callback) {
    callback = callback || function(){};

    return _this.get(key).then(function(data) {
      return _this.set(updateFunc(data)).then(callback);
    });
  };

  initialize();

  return _this;
})(jQuery, window, chrome);
