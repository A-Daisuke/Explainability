function __method_wrapper__() {
  async run(event) {
    const now = event.timestamp * 1000;

    // self subscribe only on the first time
    if (!this._hasDeployed()) {
      await this.selfSubscribe();
    }

    let scheduledEventIds = this._getScheduledEventIds() || [];

    // incoming scheduled event
    if (event.$channel === this.selfChannel()) {
      const remainingScheduledEventIds = scheduledEventIds.filter((id) => id !== event["$id"]);
      this._setScheduledEventIds(remainingScheduledEventIds);
      this.emitEvent(event, now);
      return;
    }

    // schedule new events
    const scheduledCardIds = this._getScheduledCardIds() || {};
    const cards = await this.trello.getCards({
      boardId: this.board,
    });

    for (const card of cards) {
      const dueDate = card.due
        ? new Date(card.due)
        : null;
      if (!dueDate || dueDate.getTime() < Date.now()) {
        delete scheduledCardIds[card.id];
        continue;
      }

      const later = new Date(dueDate.getTime() - ms(this.timeBefore));

      if (scheduledCardIds[card.id]) {
        // reschedule if card's due date has changed
        if (card.due !== scheduledCardIds[card.id].dueDate) {
          await this.deleteEvent({
            body: {
              id: scheduledCardIds[card.id].eventId,
            },
          });
          scheduledEventIds = scheduledEventIds
            .filter((id) => id !== scheduledCardIds[card.id].eventId);
        } else {
          continue;
        }
      }

      const scheduledEventId = this.emitScheduleEvent(card, later);
      scheduledEventIds.push(scheduledEventId);
      scheduledCardIds[card.id] = {
        eventId: scheduledEventId,
        dueDate: card.due,
      };
    }
    this._setScheduledEventIds(scheduledEventIds);
    this._setScheduledCardIds(scheduledCardIds);
  },

}
