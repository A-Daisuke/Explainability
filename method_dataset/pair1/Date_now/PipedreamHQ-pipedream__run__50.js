class __C__ {
  async run({ $ }) {
    const date = !this.date
      ? Math.floor(Date.now() / 1000)
      : Math.floor((new Date(this.date.length === 10
        ? +this.date * 1000
        : this.date)).getTime() / 1000);

    const response = await this.app.createEvent({
      $,
      data: {
        customerData: {
          email: this.email,
        },
        eventData: {
          eventType: this.eventType,
          date,
          link: this.link,
          message: this.message,
          subject: this.subject,
        },
      },
    });

    if (response.success) {
      $.export("$summary", "Successfully created event");
    }

    return response;
  },

}
