let Button = function(options) {
  this.el = this.create(options);
  this.present = false;
}

Button.prototype.create = function(options) {
  this.el = $('<button/>', Object.assign({
    type: 'button'
  }, options));

  return this.el;
}

Button.prototype.append = function(type, target) {
  if (['appendTo', 'insertBefore'].indexOf(type) === -1) { return false; }

  this.el[type](target);
  this.present = true;
}

Button.prototype.setDisability = function(toDisbale) {
  this.el.attr('disabled', toDisbale);
}

Button.prototype.setTooltips = function(autoMergeBy) {
  if (!autoMergeBy) { return false; }

  let tooltipTitle = `Auto-merged by ${autoMergeBy}`;

  this.el
    .addClass('tooltipped tooltipped-n')
    .attr({
      'aria-label': tooltipTitle,
      title: tooltipTitle
    });
}

Button.prototype.removeTooltips = function() {
  this.el
    .removeAttr('aria-label title')
    .removeClass('tooltipped tooltipped-n');
}

Button.prototype.changeText = function(textContent) {
  this.el.html(textContent);
}

Button.prototype.on = function(events) {
  this.el.on(events);
}
