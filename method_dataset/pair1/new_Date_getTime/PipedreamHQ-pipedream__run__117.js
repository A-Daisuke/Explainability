function __method_wrapper__() {
  async run({ $ }) {
    const {
      taskId,
      name,
      description,
      priority,
      assignees,
      status,
      parent,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const data = {
      name,
      description,
      assignees: {
        add: assignees,
        rem: [],
      },
      status,
      parent,
      due_date: this.dueDate
        ? new Date(this.dueDate).getTime()
        : undefined,
      start_date: this.startDate
        ? new Date(this.startDate).getTime()
        : undefined,
    };

    if (data.due_date && isNaN(data.due_date)) {
      throw new ConfigurationError("Due date is not a valid date");
    }

    if (data.start_date && isNaN(data.start_date)) {
      throw new ConfigurationError("Start date is not a valid date");
    }

    if (priority) data[priority] = constants.PRIORITIES[priority];

    const response = await this.clickup.updateTask({
      $,
      taskId,
      data,
      params,
    });

    $.export("$summary", "Successfully updated task");

    return response;
  },

}
