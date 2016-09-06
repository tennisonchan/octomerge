let buttonTextForMerge = 'Auto-merge on Build Succeeds';
let buttonTextForCancel = 'Cancel Auto-merge';
let buttonTextForConfirm = 'Confirm Auto-merge';

let Button = function(options) {
  this.id = options.id;
  this.el = this.create(options);
}

Button.prototype.create = function(options) {
  this.el = $('<button/>', Object.assign({
    type: 'button'
  }, options));

  return this.el;
}

Button.prototype.present = function() {
  return $(this.id).length !== 0;
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
  this.el.one(events);
}

class AutoMergeButtonInjecter {
  constructor() {
    console.log('AutoMergeButtonInjecter init');
    this.appendTargetClass = '.merge-message';
    this.appendConfirmButtonTargetClass = '.commit-form-actions .btn-group-merge';
    this.autoButton = new Button({
      id: 'auto-merge-button',
      class: 'btn btn-primary js-details-target auto-merge-button',
      text: buttonTextForMerge
    });
    this.confirmButton = new Button({
      id: 'confirm-button',
      class: 'btn btn-primary js-details-target confirm-button is-show',
      text: buttonTextForConfirm
    });
    this.autoMergeButtonClass = '.auto-merge-button';
    this.autoMerged = false;
    this.confirmed = false;
    this.hideMergeMessageClass = '.alt-merge-options, .merge-branch-manually';
  }

  inject(clickHandler) {
    this.hideMergeMessage();

    if (!this.autoButton.present) {
      this.autoButton.on({ click: clickHandler });
      this.autoButton.el.appendTo(this.appendTargetClass);
    }

    $('.js-details-target[type=submit]').on('click', () => {
      this.confirmButton.present && this.confirmButton.el.removeClass('is-show');
    });
  }

  setState({ confirmed, isOwner, autoMergeBy }) {
    this.confirmed = confirmed;
    this.autoButton.el.toggleClass('btn-primary', !confirmed);
    this.autoButton.setButtonDisability(!isOwner);
    if(confirmed) {
      this.autoButton.setTooltips(autoMergeBy);
      this.autoButton.changeText(buttonTextForCancel);
      this.autoButton.removeAttr('data-details-container');
    } else {
      this.autoButton.removeTooltips();
      this.autoButton.changeText(buttonTextForMerge);
      this.autoButton.attr('data-details-container', '.js-merge-pr');
    }
  }

  hideMergeMessage() {
    $(this.hideMergeMessageClass).hide();
  }

  injectConfirmButton(clickHandler) {
    if (!this.confirmButton.present) {
      this.confirmButton.on({ click: clickHandler });
      this.confirmButton.el.insertBefore(this.appendConfirmButtonTargetClass);
    }
    this.confirmButton.el.addClass('is-show');
  }
}
