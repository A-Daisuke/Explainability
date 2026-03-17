class __C__ {
    getHeaderParts(header) {
      const tolerance = 300; // seconds
      const headerParts = header?.split(",")
        .reduce((acc, part) => {
          const [
            key,
            value,
          ] = part.split("=");

          return {
            ...acc,
            [key]: value,
          };
        }, {});

      if (!headerParts.t) {
        throw new Error("Userflow-Signature header check failed: Missing t parameter");
      }

      if (!headerParts.v1) {
        throw new Error("Userflow-Signature header check failed: Missing v1 signature");
      }

      const {
        t: timestamp,
        v1: signature,
      } = headerParts;

      const timestampAge = Math.floor(Date.now() / 1000) - timestamp;

      if (timestampAge > tolerance) {
        throw new Error(`Userflow-Signature header check failed: Timestamp is more than ${tolerance} seconds ago`);
      }

      return {
        timestamp,
        signature,
      };
    },

}
