function __method_wrapper__() {
  async recordEvent(event: Omit<EventRecord, 'id' | 'createdAt'>): Promise<void> {
    const id = `event_${Date.now()}_${nanoid(8)}`;
    const record = {
      id,
      ...event,
      createdAt: new Date(),
    };

    try {
      const query = `
        INSERT INTO events (id, swarm_id, agent_id, event_type, event_name, event_data, severity, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        record.id,
        record.swarmId,
        record.agentId,
        record.eventType,
        record.eventName,
        JSON.stringify(record.eventData),
        record.severity,
        record.createdAt,
      ];

      await this.execute(query, values);
    } catch (error) {
      // Don't throw for event logging failures, just log the error
      this.logger.error('Failed to record event', { error, event: record });
    }
  }

}
