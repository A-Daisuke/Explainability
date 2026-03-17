function __method_wrapper__() {
  _notifyUserAboutEmailVerification = () => {
    const { profile, firebaseUser } = this.state.authenticatedUser;
    if (!profile) return;
    if (firebaseUser && firebaseUser.emailVerified) return;

    const now = Date.now();
    // If the user has not verified their email when logging in we show a dialog to do so.
    // - If they just registered, we don't send the email again as it will be sent automatically,
    // nor do we show a button to send again.
    // - If they are just logging in, we don't send the email but we show a button to send again.
    // Use a boolean to show the dialog only once.
    const accountAgeInMs = now - profile.createdAt;
    const hasJustCreatedAccount = accountAgeInMs < TEN_SECONDS;
    if (!this._hasNotifiedUserAboutEmailVerification) {
      setTimeout(() => {
        this.openEmailVerificationDialog({
          open: true,
          sendEmailAutomatically: false,
          showSendEmailButton: !hasJustCreatedAccount,
        });
      }, 1000);
    }
  };

}
