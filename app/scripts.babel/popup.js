'use strict';

var Popup = (function(window, $) {
  let _this = {};

  function init () {
    _this.iframe = createOctoMergeIframe();

    _this.iframe.appendTo('body');

    window.addEventListener('message', function(event) {
      if (event.origin === `${ENV.HOST}` && event.data.message === 'popup-resize') {
        let { width, height } = event.data;
        _this.iframe.css({ width, height });
      }
    }, false);
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

