class __C__ {
  async run() {
    const users = await this.lightspeedVt.listUsers();
    users.sort((a, b) => a.userId - b.userId);
    const lastUserId = this._getLastUserId();

    for (const user of users) {
      if (user.userId > lastUserId) {
        this.$emit(user, {
          id: user.userId,
          summary: `New user: ${user.username}`,
          ts: Date.now(),
        });
        this._setLastUserId(user.userId);
      }
    }
  },

}
