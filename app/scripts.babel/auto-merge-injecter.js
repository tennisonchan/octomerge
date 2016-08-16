class AutoMergeInjecter {
  constructor() {
    console.log('AutoMergeInjecter init');
    this.appendTargetClass = '.merge-message';
    this.autoButton = null;
    this.autoMergeButtonClass = '.auto-merge-button';
    this.hideMergeMessageClass = '.alt-merge-options, .merge-branch-manually';
  }

  inject() {
    this.hideMergeMessage();

    if (this.isAutoMergeButtonNotPresent()) {
      this.autoButton = this.createAutoMergeButton();
      this.autoButton.appendTo(this.appendTargetClass);
      this.autoButton.off('click').on('click', this.autoMergeEvent);
      this.setButtonDisability(false);
    }
  }

  isAutoMergeButtonNotPresent() {
    return !$(this.autoMergeButtonClass).length;
  }

  setButtonDisability(toDisbale) {
    this.autoButton && this.autoButton.attr('disabled', toDisbale);
  }

  hideMergeMessage() {
    $(this.hideMergeMessageClass).hide();
  }

  createAutoMergeButton() {
    return $('<button/>', {
      class: 'btn js-details-target auto-merge-button',
      text: 'Auto Merge',
      type: 'button'
    });
  }

  autoMergeEvent(e) {
    console.log('click');
  }
}
