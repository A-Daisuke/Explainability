  export const makeUuid = <MakeUUID>function (): string {
    // Fallback to non cryptographically secure UUIDs if not supported
    if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
      const makeMathRandomUuid = (a?: any): string => {
        return a
          ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
          : ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(
              /[018]/g,
              makeMathRandomUuid
            );
      };

      return makeMathRandomUuid();
    }

    if (!gdjs.makeUuid.hex) {
      gdjs.makeUuid.hex = [];

      for (var i = 0; i < 256; i++) {
        gdjs.makeUuid.hex[i] = (i < 16 ? '0' : '') + i.toString(16);
      }
    }
    const hex = gdjs.makeUuid.hex;

    var r = crypto.getRandomValues(new Uint8Array(16));
    r[6] = (r[6] & 0x0f) | 0x40;
    r[8] = (r[8] & 0x3f) | 0x80;

    return (
      hex[r[0]] +
      hex[r[1]] +
      hex[r[2]] +
      hex[r[3]] +
      '-' +
      hex[r[4]] +
      hex[r[5]] +
      '-' +
      hex[r[6]] +
      hex[r[7]] +
      '-' +
      hex[r[8]] +
      hex[r[9]] +
      '-' +
      hex[r[10]] +
      hex[r[11]] +
      hex[r[12]] +
      hex[r[13]] +
      hex[r[14]] +
      hex[r[15]]
    );
  };
