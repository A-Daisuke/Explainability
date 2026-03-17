function __method_wrapper__() {
  async run({ $ }) {
    const description = await this.gocanvas.getDispatchDescription({
      $,
      dispatchId: this.dispatchId,
    });
    const response = await this.gocanvas.dispatchItems({
      $,
      data: `
        <?xml version="1.0" encoding="utf-8"?>
          <List>
            <DI FormName="${this.form}" Action="Delete" OriginalDescription="${description}">
              <DIEntry Label="Date" Value="${Date.now()}"/>
            </DI>
          </List>
      `,
    });
    $.export("$summary", `Successfully deleted dispatch with ID ${this.dispatchId}`);
    return response;
  },

}
