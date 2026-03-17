function __method_wrapper__() {
    getMeta({ entry }) {
      if (entry) {
        const {
          uuid, time,
        } = entry[0];

        const eventTime = time || new Date().getTime();

        return {
          id: uuid,
          summary: `New job created with uuid: ${uuid}`,
          ts: eventTime,
        };
      }
    },

}
