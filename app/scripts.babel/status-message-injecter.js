class StatusMessageInjecter {
  constructor() {
    console.log('StatusMessageInjecter init');
    this.appendTargetClass = '.merge-message';
    this.statusMessageClass = '.auto-merge-status-message';
    this.messageElement = null;
  }

  inject(type, options) {
    if (!this.isStatusMessagePresent(type)) {
      this.messageElement = $('<div/>').appendTo(this.appendTargetClass);
      this.updateMessage(type, options);
    }
  }

  updateMessage(type, options) {
    if (type === 'last-try' && options.lastUpdated) {
      this.messageElement = this.messageElement.replaceWith(this.createLastTryMessage(options));
    }
  }

  isStatusMessagePresent(type) {
    let elementClass = type ? `.${type}-message` : this.statusMessageClass;
    return !!$(elementClass).length;
  }

  toggle(toShow) {
    this.messageElement.toggle(toShow);
  }

  createLastTryMessage({ lastUpdated }) {
    let localTime = moment(lastUpdated).format('LLLL');

    let relativeTime = $('<relative-time/>', {
      'aria-label': localTime,
      class: 'tooltipped tooltipped-n last-try-relative-time',
      datetime: lastUpdated,
      title: localTime,
      text: moment(lastUpdated).fromNow()
    });

    return $('<div/>', {
      class: 'auto-merge-status-message last-try-message text-small',
      text: 'Last try: '
    }).append(relativeTime);
  }
}
