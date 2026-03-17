function __method_wrapper__() {
  async createAgent(agent: Omit<AgentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AgentRecord> {
    const id = `agent_${Date.now()}_${nanoid(10)}`;
    const now = new Date();

    const record: AgentRecord = {
      id,
      ...agent,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const query = `
        INSERT INTO agents (id, swarm_id, type, name, status, capabilities, config, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        record.id,
        record.swarmId,
        record.type,
        record.name,
        record.status,
        JSON.stringify(record.capabilities),
        JSON.stringify(record.config),
        JSON.stringify(record.metadata),
        record.createdAt,
        record.updatedAt,
      ];

      await this.execute(query, values);
      return record;
    } catch (error) {
      throw new DatabaseError('Failed to create agent', { error, agentId: id });
    }
  }

}
