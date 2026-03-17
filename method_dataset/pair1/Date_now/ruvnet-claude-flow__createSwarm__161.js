function __method_wrapper__() {
  async createSwarm(swarm: Omit<SwarmRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<SwarmRecord> {
    const id = `swarm_${Date.now()}_${nanoid(10)}`;
    const now = new Date();

    const record: SwarmRecord = {
      id,
      ...swarm,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const query = `
        INSERT INTO swarms (id, name, topology, max_agents, strategy, status, config, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        record.id,
        record.name,
        record.topology,
        record.maxAgents,
        record.strategy,
        record.status,
        JSON.stringify(record.config),
        record.createdAt,
        record.updatedAt,
      ];

      await this.execute(query, values);
      return record;
    } catch (error) {
      throw new DatabaseError('Failed to create swarm', { error, swarmId: id });
    }
  }

}
