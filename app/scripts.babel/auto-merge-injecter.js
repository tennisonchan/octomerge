let buttonTextForMerge = 'Auto-merge on Build Succeeds';
let buttonTextForCancel = 'Cancel Auto-merge';
let buttonTextForConfirm = 'Confirm Auto-merge';

let Button = function() {
  this.el = null;
}

Button.prototype.create = function(options) {
  this.el = $('<button/>', Object.assign({
    type: 'button'
  }, options));

  return this.el;
}

Button.prototype.present = function() {

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


class AutoMergeButtonInjecter {
  constructor() {
    console.log('AutoMergeButtonInjecter init');
    this.appendTargetClass = '.merge-message';
    this.appendConfirmButtonTargetClass = '.commit-form-actions .btn-group-merge';
    this.autoButton = new Button().create({
      class: 'btn btn-primary js-details-target auto-merge-button',
      text: buttonTextForMerge
    });
    this.confirmButton = null;
    this.autoMergeButtonClass = '.auto-merge-button';
    this.autoMerged = false;
    this.confirmed = false;
    this.hideMergeMessageClass = '.alt-merge-options, .merge-branch-manually';
  }

  inject(clickHandler) {
    this.hideMergeMessage();

    if (!this.isAutoMergeButtonPresent()) {
      this.autoButton.appendTo(this.appendTargetClass);
      this.autoButton.on('click', clickHandler);
    }

    $('.js-details-target[type=submit]').on('click', () => {
      this.confirmButton && this.confirmButton.removeClass('is-show');
    });
  }

  isAutoMergeButtonPresent() {
    return !!$(this.autoMergeButtonClass).length;
  }

  setState({ confirmed, isOwner, autoMergeBy }) {
    this.confirmed = confirmed;
    this.autoButton.toggleClass('btn-primary', !confirmed);
    if(confirmed) {
      this.setButtonDisability(!isOwner);
      this.setTooltips(autoMergeBy);
      this.changeText(buttonTextForCancel);
      this.autoButton.removeAttr('data-details-container');
    } else {
      this.removeTooltips();
      this.changeText(buttonTextForMerge);
      this.autoButton.attr('data-details-container', '.js-merge-pr');
    }
  }

  setButtonDisability(toDisbale) {
    this.autoButton.attr('disabled', toDisbale);
  }

  setTooltips(autoMergeBy) {
    let tooltipTitle = `Auto-merged by ${autoMergeBy}`;

    this.autoButton.attr({
      'aria-label': tooltipTitle,
      title: tooltipTitle
    });

    this.autoButton.addClass('tooltipped tooltipped-n');
  }

  removeTooltips() {
    this.autoButton.removeAttr('aria-label title');
    this.autoButton.removeClass('tooltipped tooltipped-n');
  }

  changeText(textContent) {
    this.autoButton.html(textContent);
  }

  hideMergeMessage() {
    $(this.hideMergeMessageClass).hide();
  }

  injectConfirmButton(clickHandler) {
    if (!this.confirmButton) {
      this.confirmButton = new Button().create({
        class: 'btn btn-primary js-details-target confirm-button is-show',
        text: buttonTextForConfirm
      });
      this.confirmButton.insertBefore(this.appendConfirmButtonTargetClass);
      this.confirmButton.on('click', clickHandler);
    }
    this.confirmButton.addClass('is-show');
  }
}
