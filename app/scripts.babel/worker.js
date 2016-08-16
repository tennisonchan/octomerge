let Worker = (function () {
  let _this = {};

  _this.performUntil = function(job) {
    let deferred = $.Deferred();

    setTimeout(function(){
      job(deferred);
    }, 30 * 1000);

    return deferred.promise();
  }

  return _this;
})()