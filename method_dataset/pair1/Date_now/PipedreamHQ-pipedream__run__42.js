class __C__ {
  async run(event) {
    if (!this.verifyEvent(event)) return;

    const cardData = event.body.data;
    const cardId = cardData.card.id;
    const card = (await this.pipefy.getCard(cardId)).card;
    const {
      body, id, summary,
    } = this.getMeta(card, cardData);
    this.$emit(body, {
      id,
      summary,
      ts: Date.now(),
    });
  },

}
