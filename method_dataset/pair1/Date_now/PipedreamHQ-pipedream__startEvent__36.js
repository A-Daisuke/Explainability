function __method_wrapper__() {
    async startEvent() {
      const { taskId } = this;
      const lastStatusName = this._getLastStatusName();

      const task = await this.motion.getTask({
        taskId,
      });

      if (lastStatusName != task.status.name) {
        const ts = Date.now();
        this.$emit(
          task,
          {
            id: `${task.id}+${ts}`,
            summary: `The status of the task: "${taskId}" was updated!`,
            ts,
          },
        );

        this._setLastStatusName(task.status.name);
      }
    },

}
