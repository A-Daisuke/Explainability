function __method_wrapper__() {
    getMetadata(payload) {
      const {
        amznTraceId,
        SaleID,
        SaleOrderNumber,
      } = payload;

      const compositeId = `${SaleID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new sale with OrderNumber: ${SaleOrderNumber} was successfully undone!`,
        ts: Date.now(),
      };
    },

}
