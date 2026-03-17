class __C__ {
  async run(event) {
    // self subscribe only on the first time
    if (!this._hasDeployed()) {
      await this.selfSubscribe(this.pipedreamApiKey);
    }

    const scheduledEventIds = this._getScheduledEventIds() || [];

    // incoming scheduled event
    if (event.$channel === this.selfChannel()) {
      const remainingScheduledEventIds = scheduledEventIds.filter((id) => id !== event["$id"]);
      this._setScheduledEventIds(remainingScheduledEventIds);
      this.emitEvent(event, `Upcoming ${event.summary
        ? event.summary + " "
        : ""}event`);
      return;
    }

    // schedule new events
    const scheduledCalendarEventIds = this._getScheduledCalendarEventIds() || {};
    const calendarEvents = await this.getCalendarEvents();

    for (const calendarEvent of calendarEvents) {
      const startTime = calendarEvent.start
        ? (new Date(calendarEvent.start.dateTime || calendarEvent.start.date))
        : null;
      if (!startTime
        || startTime.getTime() < Date.now()
        || scheduledCalendarEventIds[calendarEvent.id])
      {
        continue;
      }
      const later = new Date(this.subtractMinutes(startTime, this.time));

      const scheduledEventId = this.emitScheduleEvent(calendarEvent, later);
      scheduledEventIds.push(scheduledEventId);
      scheduledCalendarEventIds[calendarEvent.id] = true;
    }
    this._setScheduledEventIds(scheduledEventIds);
    this._setScheduledCalendarEventIds(scheduledCalendarEventIds);
  },

}
