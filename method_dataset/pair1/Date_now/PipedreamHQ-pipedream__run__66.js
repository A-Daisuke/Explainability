class __C__ {
  async run(event) {
    const { body } = event;
    let { content: submission } = await this.jotform.getFormSubmission({
      submissionId: body.submissionID,
      teamId: this.teamId,
    });

    // insert answers from the webhook event
    const rawRequest = JSON.parse(body.rawRequest);
    for (const key of Object.keys(rawRequest)) {
      const regex = /^q(\d+)_/;
      const match = key.match(regex);
      if (match && match[1]) {
        submission.answers[match[1]].answer = rawRequest[key];
      }
    }

    this.$emit(submission, {
      summary: body.formTitle || JSON.stringify(body),
      id: body.submissionID,
      ts: Date.now(),
    });
  },

}
