class __C__ {
    async activate() {
      const {
        affected_objects: [
          {
            id: webhookId,
            secret_key: secretKey,
          },
        ],
      } = await this.app.createWebhookSubscription({
        data: {
          name: [
            `Pipedream Webhook ${Date.now()}`,
          ],
          description: [
            `Pipedream Webhook ${Date.now()}`,
          ],
          callback_url: [
            this.http.endpoint,
          ],
          enabled: [
            true,
          ],
          trigger_id: [
            this.getTriggerId(),
          ],
        },
      });
      this.setWebhookId(webhookId);
      this.setSecretKey(secretKey);
    },

}
