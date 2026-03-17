class __C__ {
    async deploy() {
      // emit historical events
      const { events } = await this.datadog.getEvents({
        params: {
          start: Math.floor(this.datadog.daysAgo(7) / 1000), // one week ago
          end: Math.floor(Date.now() / 1000), // now
        },
        region: this.region,
      });
      const relevantEvents = events.filter((event) => this.monitors.includes(event.monitor_id));

      for (const event of relevantEvents.reverse().slice(-25)) {
        const payload = {
          alertTitle: event.eventTitle,
          alertType: event.alert_type,
          date: event.date_happened,
          eventMsg: event.text,
          eventTitle: event.title,
          hostname: event.host,
          id: event.id,
          lastUpdated: event.date_happened,
          link: `https://app.datadoghq.com${event.url}`,
          priority: event.priority,
          tags: event.tags.join(),
        };
        const meta = this.generateMeta(payload);
        this.$emit(payload, meta);
      }
    },

}
