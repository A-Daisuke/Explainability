class __C__ {
    async activate() {
      const version = "2.0.0";
      const response = await this.wise.createWebhook({
        profileId: this.profileId,
        data: {
          name: `Pipedream - ${new Date().getTime()}`,
          trigger_on: this.getWebhookEventType(),
          delivery: {
            version,
            url: this.http.endpoint,
          },
        },
      });

      this._setWebhookId(response.id);
    },

}
