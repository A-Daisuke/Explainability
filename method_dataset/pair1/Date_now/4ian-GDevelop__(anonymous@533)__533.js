function __method_wrapper__() {
  describe('Firebase authentication', () => {
    // Generate basic credentials
    const email = `test${Math.random().toString(
      16
    )}${Date.now()}@test-account.com`;
    const password = `myPass${Math.random().toString(16)}${Date.now()}!`;
    const password2 = `myNewPass${Math.random().toString(16)}${Date.now()}!`;

    const expectToNotLogin = async (password) => {
      if (gdjs.evtTools.firebaseTools.auth.isAuthenticated())
        await firebase.auth().signOut();

      let errors = false;
      try {
        await promisifyCallbackVariables((callback) =>
          gdjs.evtTools.firebaseTools.auth.signInWithEmail(
            email,
            password,
            callback
          )
        );
      } catch (e) {
        errors = true;
      }

      // No error was thrown, there is an issue
      if (!errors)
        throw new Error('Expected wrong credentials to prevent login');

      expect(gdjs.evtTools.firebaseTools.auth.isAuthenticated()).to.not.be.ok();
    };

    const expectToLogin = async (password) => {
      if (gdjs.evtTools.firebaseTools.auth.isAuthenticated())
        await firebase.auth().signOut();

      await promisifyCallbackVariables((callback) =>
        gdjs.evtTools.firebaseTools.auth.signInWithEmail(
          email,
          password,
          callback
        )
      );

      expect(gdjs.evtTools.firebaseTools.auth.isAuthenticated()).to.be.ok();
    };

    before(async () => firebase.auth().signOut());

    it('let users create accounts', async () => {
      expect(gdjs.evtTools.firebaseTools.auth.isAuthenticated()).to.not.be.ok();

      await promisifyCallbackVariables((callback) =>
        gdjs.evtTools.firebaseTools.auth.createAccountWithEmail(
          email,
          password,
          callback
        )
      );

      expect(gdjs.evtTools.firebaseTools.auth.isAuthenticated()).to.be.ok();
    });

    it('let users log out', async () => {
      expect(gdjs.evtTools.firebaseTools.auth.isAuthenticated()).to.be.ok();
      await firebase.auth().signOut();
      expect(gdjs.evtTools.firebaseTools.auth.isAuthenticated()).to.not.be.ok();
    });

    it('prevents logging in with invalid credentials', async () =>
      expectToNotLogin('InvalidPassword321'));

    it('let users log in', async () => expectToLogin(password));

    it('Let users get/set basic profile data', async () => {
      await gdjs.evtTools.firebaseTools.auth.userManagement.setDisplayName(
        'Hello'
      );
      expect(
        gdjs.evtTools.firebaseTools.auth.userManagement.getDisplayName()
      ).to.be.string('Hello');

      await gdjs.evtTools.firebaseTools.auth.userManagement.setDisplayName(
        'World'
      );
      expect(
        gdjs.evtTools.firebaseTools.auth.userManagement.getDisplayName()
      ).to.be.string('World');
    });

    it('let users change their password', async () => {
      await promisifyCallbackVariables((callback) =>
        gdjs.evtTools.firebaseTools.auth.userManagement.dangerous.changePassword(
          email,
          password,
          password2,
          callback
        )
      );

      await expectToNotLogin(password);
      await expectToLogin(password2);
    });

    it('let users delete their account', async () => {
      await expectToLogin(password2);

      await promisifyCallbackVariables((callback) =>
        gdjs.evtTools.firebaseTools.auth.userManagement.dangerous.deleteUser(
          email,
          password2,
          callback
        )
      );

      return expectToNotLogin(password2);
    });
  });

}
