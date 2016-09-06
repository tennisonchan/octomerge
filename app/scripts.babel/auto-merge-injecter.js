let buttonTextForMerge = 'Auto-merge on Build Succeeds';
let buttonTextForCancel = 'Cancel Auto-merge';
let buttonTextForConfirm = 'Confirm Auto-merge';

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

class AutoMergeButtonInjecter {
  constructor() {
    console.log('AutoMergeButtonInjecter init');
    this.autoMergeButtonAppendTargetSelector = '.merge-message';
    this.confirmButtonAppendTargetSelector = '.commit-form-actions .btn-group-merge';
    this.mergePrButtonSelector = '.js-details-target[type=submit]';
    this.hideMergeMessageSelectors = '.alt-merge-options, .merge-branch-manually';
    this.confirmed = false;
    this.autoButton = new Button({
      class: 'btn btn-primary js-details-target auto-merge-button',
      text: buttonTextForMerge
    });
    this.confirmButton = new Button({
      class: 'btn btn-primary js-details-target confirm-button is-show',
      text: buttonTextForConfirm
    });
  }

  inject(clickHandler) {
    this.hideMergeMessage();

    if (!this.autoButton.present) {
      this.autoButton.on({ click: clickHandler });
      this.autoButton.append('appendTo', this.autoMergeButtonAppendTargetSelector);
    }

    $(this.mergePrButtonSelector).on({
      click: () => {
        this.confirmButton.present && this.confirmButton.el.removeClass('is-show');
      }
    });
  }

  setState({ confirmed, isOwner, autoMergeBy }) {
    this.confirmed = confirmed;
    this.autoButton.el.toggleClass('btn-primary', !confirmed);
    if(confirmed) {
      this.autoButton.setDisability(!isOwner);
      this.autoButton.setTooltips(autoMergeBy);
      this.autoButton.changeText(buttonTextForCancel);
      this.autoButton.el.removeAttr('data-details-container');
    } else {
      this.autoButton.removeTooltips();
      this.autoButton.changeText(buttonTextForMerge);
      this.autoButton.el.attr('data-details-container', '.js-merge-pr');
    }
  }

  hideMergeMessage() {
    $(this.hideMergeMessageSelectors).hide();
  }

  injectConfirmButton(clickHandler) {
    if (!this.confirmButton.present) {
      this.confirmButton.on({ click: clickHandler });
      this.confirmButton.append('insertBefore', this.confirmButtonAppendTargetSelector);
    }
    this.confirmButton.el.addClass('is-show');
  }
}
