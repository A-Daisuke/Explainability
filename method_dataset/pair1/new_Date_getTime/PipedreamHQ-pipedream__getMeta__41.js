function __method_wrapper__() {
    getMeta(item: RaidEvent) {
      const {
        id,
        created_at: createdAt,
        from_broadcaster_user_name: userNameFrom,
        from_broadcaster_user_login: loginFrom,
        to_broadcaster_user_name: userNameTo,
        to_broadcaster_user_login: loginTo,
      } = item;
      const ts = new Date(createdAt).getTime();
      return {
        id,
        summary: `${userNameFrom} (${loginFrom}) raided ${userNameTo} (${loginTo})`,
        ts,
      };
    },

}
