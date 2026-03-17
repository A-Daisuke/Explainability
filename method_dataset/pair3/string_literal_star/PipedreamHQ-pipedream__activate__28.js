class __C__ {
    async activate() {
      const { data } = await this.outreach.createHook({
        data: {
          data: {
            attributes: {
              action: "*",
              active: true,
              resource: this.getResource(),
              url: this.http.endpoint,
            },
            type: "webhook",
          },
        },
      });
      this.setHookId(data.id);
    },

}
