function __method_wrapper__() {
  async createTask(task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskRecord> {
    const id = `task_${Date.now()}_${nanoid(10)}`;
    const now = new Date();

    const record: TaskRecord = {
      id,
      ...task,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const query = `
        INSERT INTO tasks (id, swarm_id, description, priority, strategy, status, max_agents, requirements, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        record.id,
        record.swarmId,
        record.description,
        record.priority,
        record.strategy,
        record.status,
        record.maxAgents,
        JSON.stringify(record.requirements),
        JSON.stringify(record.metadata),
        record.createdAt,
        record.updatedAt,
      ];

      await this.execute(query, values);
      return record;
    } catch (error) {
      throw new DatabaseError('Failed to create task', { error, taskId: id });
    }
  }

}
