class __C__ {
    emit(isNew, newData, oldData, changedKeys) {
      const event = {
        newData,
        oldData,
        changedKeys,
      };

      const createOrUpdatedString = isNew
        ? "created"
        : "updated";
      this.$emit(event, {
        summary: `${newData[this.getLookUpKey()]} was ${createOrUpdatedString}`,
        id: uuid(),
        ts: Date.now(),
      });
    },

}
