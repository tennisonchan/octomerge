class StatusMessageInjecter {
  constructor() {
    this.appendTargetClass = '.merge-message';
    this.statusMessageClass = '.auto-merge-status-message';
    this.messageElement = $('<div/>', { class: 'auto-merge-status-message' });
  }

  inject(type, options) {
    if (!this.isStatusMessagePresent(type)) {
      this.messageElement.appendTo(this.appendTargetClass);
    }
    this.updateMessage(type, options);
    this.toggle(options.toShow);
  }

  updateMessage(type, options) {
    if (type === 'last-try' && options.toShow) {
      let newElement = this.createLastTryMessage(options);
      this.messageElement.replaceWith(newElement);
      this.messageElement = newElement;
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
    lastUpdated = lastUpdated || new Date();
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
