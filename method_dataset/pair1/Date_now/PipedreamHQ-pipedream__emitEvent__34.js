function __method_wrapper__() {
    async emitEvent(event) {
      const { body } = event;
      if (!body || !body.events) return;

      for (const e of body.events) {
        const { data: membership } = await this.asana.getWorkspaceMembership({
          membershipId: e.resource.gid,
        });
        const { data: user } = await this.asana.getUser({
          userId: membership.user.gid,
        });

        this.$emit(user, {
          id: user.gid,
          summary: user.name,
          ts: Date.now(),
        });
      }
    },

}
