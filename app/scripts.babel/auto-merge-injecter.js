class AutoMergeButtonInjecter {
  constructor() {
    console.log('AutoMergeButtonInjecter init');
    this.appendTargetClass = '.merge-message';
    this.autoButton = this.createAutoMergeButton();
    this.autoMergeButtonClass = '.auto-merge-button';
    this.clicked = false;
    this.hideMergeMessageClass = '.alt-merge-options, .merge-branch-manually';
    this.relativeTime = $('<relative-time/>');
    this.lastUpdateMessage = $('<p/>', { class: 'alt-auto-merge text-small', text: 'Last try: '})
      .append(this.relativeTime);
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

  setState(clicked, lastUpdated) {
    this.clicked = clicked;
    this.autoButton.toggleClass('btn-primary', !clicked);
    this.changeText(clicked ? 'Cancel Auto Merge' : 'Auto Merge');
    this.showLastUpdateMessage(lastUpdated).appendTo(this.appendTargetClass).toggle(clicked);
  }

  setButtonDisability(toDisbale) {
    this.autoButton.attr('disabled', toDisbale);
  }

  changeText(textContent) {
    this.autoButton.html(textContent);
  }

  hideMergeMessage() {
    $(this.hideMergeMessageClass).hide();
  }

  showLastUpdateMessage(lastUpdated) {
    let localTime = moment(lastUpdated).format('LLLL');

    this.relativeTime = this.relativeTime.replaceWith($('<relative-time/>', {
      'aria-label': localTime,
      class: 'tooltipped tooltipped-n last-try-relative-time',
      datetime: lastUpdated,
      title: localTime,
      text: moment(lastUpdated).fromNow()
    }));

    return this.lastUpdateMessage;
  }

  createAutoMergeButton() {
    return $('<button/>', {
      class: 'btn btn-primary js-details-target auto-merge-button',
      text: 'Auto Merge',
      type: 'button'
    });
  }
}
