class __C__ {
    async deploy() {
      const { content: form } = await this.jotform.getForm(this.formId, this.teamId);
      const { content: submissions } = await this.jotform.getFormSubmissions({
        formId: this.formId,
        teamId: this.teamId,
        params: {
          limit: 25,
          orderby: "created_at",
        },
      });
      for (let submission of submissions.reverse()) {
        const meta = {
          id: submission.id,
          summary: form.title,
          ts: Date.now(),
        };
        this.$emit(submission, meta);
      }
    },

}
