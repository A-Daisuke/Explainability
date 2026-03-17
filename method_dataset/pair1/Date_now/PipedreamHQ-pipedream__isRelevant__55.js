function __method_wrapper__() {
    isRelevant(assignment) {
      if (!this.assignmentType || this.assignmentType === "all") {
        return true;
      }
      if (!assignment.dueDate) {
        return false;
      }

      const dueDate = this.getDueTs(assignment.dueDate, assignment.dueTime);

      if (this.assignmentType === "past due") {
        return dueDate < Date.now();
      }
      if (this.assignmentType === "not yet due") {
        return dueDate > Date.now();
      }
    },

}
