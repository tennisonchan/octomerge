'use strict';

var Popup = (function(window, $) {
  let _this = {};

  function init () {
    _this.iframe = createOctoMergeIframe();

    _this.iframe.appendTo('body');
  }

  function createOctoMergeIframe (options) {
    return $('<iframe/>', $.extend({
      id: 'octomerge-iframe',
      src: ENV.HOST
    }, options))
    .append('<p/>', {
      text: 'Your browser does not support iframes.'
    });
  }

  init();

  return _this;
})(window, jQuery);

