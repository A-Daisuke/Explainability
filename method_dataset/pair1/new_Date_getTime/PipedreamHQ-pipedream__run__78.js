function __method_wrapper__() {
  async run({ $ }) {
    const start = new Date(+this.start || this.start).getTime();
    const end = new Date(+this.end || this.end).getTime();

    const data = {
      tid: this.taskId,
      description: this.description,
      start,
      end,
      stop: end,
    };

    console.log(data);

    const response = await this.clickup.createTimeEntry({
      $,
      teamId: this.workspaceId,
      params: {
        custom_task_ids: this.useCustomTaskIds,
      },
      data,
    });

    $.export("$summary", "Successfully created a new time entry");

    return response;
  },

}
