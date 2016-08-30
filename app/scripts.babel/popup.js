'use strict';

var Popup = (function(window, $) {
  let _this = {};

  function init () {
    _this.iframe = createOctoMergeIframe();

    _this.iframe.appendTo('body');
  }

  function createOctoMergeIframe (options) {
    options = options || {};

    return $('<iframe/>', $.extend({
      id: 'octomerge-iframe',
      src: ENV.HOST + '/auto_merges?iframe=1'
    }, options))
    .append('<p/>', {
      text: 'Your browser does not support iframes.'
    });
  }

  init();

  return _this;
})(window, jQuery);

