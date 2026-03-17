function __method_wrapper__() {
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
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
