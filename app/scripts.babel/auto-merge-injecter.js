class AutoMergeButtonInjecter {
  constructor() {
    console.log('AutoMergeButtonInjecter init');
    this.appendTargetClass = '.merge-message';
    this.autoButton = this.createAutoMergeButton();
    this.autoMergeButtonClass = '.auto-merge-button';
    this.clicked = false;
    this.hideMergeMessageClass = '.alt-merge-options, .merge-branch-manually';
  }

  inject(clickHandler) {
    this.hideMergeMessage();

    if (!this.isAutoMergeButtonPresent()) {
      this.autoButton.appendTo(this.appendTargetClass);
      this.autoButton.off('click').on('click', clickHandler);
    }
  }

  isAutoMergeButtonPresent() {
    return !!$(this.autoMergeButtonClass).length;
  }

  setState({ clicked, isOwner, autoMergeBy }) {
    this.clicked = clicked;
    this.autoButton.toggleClass('btn-primary', !clicked);
    this.changeText(clicked ? 'Cancel Auto Merge' : 'Auto Merge');
    if(clicked) {
      this.setButtonDisability(!isOwner);
      this.setTooltips(autoMergeBy);
    }
  }

  setButtonDisability(toDisbale) {
    this.autoButton.attr('disabled', toDisbale);
  }

  setTooltips(autoMergeBy) {
    let tooltipTitle = `Auto merged by ${autoMergeBy}`;

    this.autoButton.attr({
      'aria-label': tooltipTitle,
      title: tooltipTitle
    });

    this.autoButton.addClass('tooltipped tooltipped-n');
  }

  changeText(textContent) {
    this.autoButton.html(textContent);
  }

  hideMergeMessage() {
    $(this.hideMergeMessageClass).hide();
  }

  createAutoMergeButton() {
    return $('<button/>', {
      class: 'btn btn-primary js-details-target auto-merge-button',
      text: 'Auto Merge',
      type: 'button'
    });
  }
}
