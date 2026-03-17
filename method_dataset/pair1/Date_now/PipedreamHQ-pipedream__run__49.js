function __method_wrapper__() {
  async run(data: SourceHttpRunOptions) {
    this.http.respond({
      status: 200,
    });

    const { body } = data;

    let { id } = body;
    if (typeof id !== "string") {
      id = Date.now();
    }

    let summary = body.type;
    if (typeof summary !== "string") {
      summary = "Unknown event type";
    }

    const date = body.occured_at;
    const ts = typeof date === "string"
      ? new Date(date).valueOf()
      : Date.now();

    this.$emit(body, {
      id,
      summary,
      ts,
    });
  },

}
