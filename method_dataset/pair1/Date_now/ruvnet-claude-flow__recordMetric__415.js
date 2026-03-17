function __method_wrapper__() {
  async recordMetric(metric: Omit<MetricRecord, 'id' | 'timestamp'>): Promise<void> {
    const id = `metric_${Date.now()}_${nanoid(8)}`;
    const record = {
      id,
      ...metric,
      timestamp: new Date(),
    };

    try {
      const query = `
        INSERT INTO performance_metrics (id, swarm_id, agent_id, metric_type, metric_name, metric_value, unit, timestamp, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        record.id,
        record.swarmId,
        record.agentId,
        record.metricType,
        record.metricName,
        record.metricValue,
        record.unit,
        record.timestamp,
        JSON.stringify(record.metadata),
      ];

      await this.execute(query, values);
    } catch (error) {
      throw new DatabaseError('Failed to record metric', { error, metricId: id });
    }
  }

}
