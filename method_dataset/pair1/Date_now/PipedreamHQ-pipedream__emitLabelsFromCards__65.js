function __method_wrapper__() {
    async emitLabelsFromCards(cards) {
      for (const card of cards) {
        const labelIds = card.idLabels;
        for (const labelId of labelIds) {
          const label = await this.app.getLabel({
            labelId,
          });
          let summary = label.color;
          summary += label.name
            ? ` - ${label.name}`
            : "";
          summary += `; added to ${card.name}`;
          this.$emit(card, {
            id: `${labelId}${card.id}`,
            summary,
            ts: Date.now(),
          });
        }
      }
    },

}
