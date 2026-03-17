class __C__ {
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        // This conditional ignores when Asana fires a new subtask event
        if (e.parent && e.parent.resource_type === "task") continue;

        const { data: task } = await this.asana.getTask({
          taskId: e.resource.gid,
        });

        this.$emit(task, {
          id: task.gid,
          summary: task.name,
          ts: Date.now(),
        });
      }
    },

}
