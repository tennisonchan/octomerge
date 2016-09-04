let buttonTextForLogin = 'Login for Auto-merge';

class LoginButtonInjecter {
  constructor() {
    console.log('LoginButtonInjecter#init');
    this.appendTargetClass = '.merge-message';
    this.loginButton = this.createLoginButton();
    this.loginButtonClass = '.login-button';
    this.hideMergeMessageClass = '.alt-merge-options, .merge-branch-manually';
  }

  inject(clickHandler) {
    this.hideMergeMessage();

    if (!this.isLoginButtonPresent()) {
      this.loginButton.appendTo(this.appendTargetClass);
      this.loginButton.off('click').on('click', clickHandler);
    }
  }

  isLoginButtonPresent() {
    return !!$(this.loginButtonClass).length;
  }

  setButtonDisability(toDisbale) {
    this.loginButton.attr('disabled', toDisbale);
  }

  hideMergeMessage() {
    $(this.hideMergeMessageClass).hide();
  }

  createLoginButton() {
    return $('<button/>', {
      class: 'btn js-details-target login-button',
      text: buttonTextForLogin,
      type: 'button'
    });
  }
}
