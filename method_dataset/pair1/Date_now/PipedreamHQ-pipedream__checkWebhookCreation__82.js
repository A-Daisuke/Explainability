class __C__ {
    async checkWebhookCreation() {
      const admin = await this.checkAdminPermission();
      if (admin) {
        await this.createWebhook();
        this.$emit(this.getSampleWebhookEvent(), {
          id: "sample_webhook_event",
          summary: "Sample Webhook Event",
          ts: Date.now(),
        });
      } else {
        await this.removeWebhook();
        this.$emit(this.getSampleTimerEvent(), {
          id: "sample_timer_event",
          summary: "Sample Timer Event",
          ts: Date.now(),
        });
      }
    },

}
