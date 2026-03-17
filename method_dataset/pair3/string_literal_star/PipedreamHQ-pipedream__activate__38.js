function __method_wrapper__() {
    async activate() {
      let enabledEvents = this.getEvents();

      if (enabledEvents.includes("*")) enabledEvents = [
        "*",
      ];

      const endpoint = await this.app.sdk().webhookEndpoints.create({
        url: this.http.endpoint,
        enabled_events: enabledEvents,
      });
      this.db.set("endpoint", JSON.stringify(endpoint));

      for (const eventType of enabledEvents) {
        const events = await this.app.getEvents({
          eventType,
        });

        for (const event of events) {
          this.emitEvent(event);
        }
      }
    },

}
