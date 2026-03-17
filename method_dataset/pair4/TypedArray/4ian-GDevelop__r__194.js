function r(t, e, r, i) {
  switch (t) {
    case 'HEX':
      return function(n) {
        return (function(n, t, e, r) {
          const i = '0123456789abcdef';
          let s,
            o,
            w = '';
          const h = t / 8,
            u = -1 === e ? 3 : 0;
          for (s = 0; s < h; s += 1)
            (o = n[s >>> 2] >>> (8 * (u + e * (s % 4)))),
              (w += i.charAt((o >>> 4) & 15) + i.charAt(15 & o));
          return r.outputUpper ? w.toUpperCase() : w;
        })(n, e, r, i);
      };
    case 'B64':
      return function(t) {
        return (function(t, e, r, i) {
          let s,
            o,
            w,
            h,
            u,
            c = '';
          const f = e / 8,
            a = -1 === r ? 3 : 0;
          for (s = 0; s < f; s += 3)
            for (
              h = s + 1 < f ? t[(s + 1) >>> 2] : 0,
                u = s + 2 < f ? t[(s + 2) >>> 2] : 0,
                w =
                  (((t[s >>> 2] >>> (8 * (a + r * (s % 4)))) & 255) << 16) |
                  (((h >>> (8 * (a + r * ((s + 1) % 4)))) & 255) << 8) |
                  ((u >>> (8 * (a + r * ((s + 2) % 4)))) & 255),
                o = 0;
              o < 4;
              o += 1
            )
              c +=
                8 * s + 6 * o <= e
                  ? n.charAt((w >>> (6 * (3 - o))) & 63)
                  : i.b64Pad;
          return c;
        })(t, e, r, i);
      };
    case 'BYTES':
      return function(n) {
        return (function(n, t, e) {
          let r,
            i,
            s = '';
          const o = t / 8,
            w = -1 === e ? 3 : 0;
          for (r = 0; r < o; r += 1)
            (i = (n[r >>> 2] >>> (8 * (w + e * (r % 4)))) & 255),
              (s += String.fromCharCode(i));
          return s;
        })(n, e, r);
      };
    case 'ARRAYBUFFER':
      try {
        new ArrayBuffer(0);
      } catch (n) {
        throw new Error('ARRAYBUFFER not supported by this environment');
      }
      return function(n) {
        return (function(n, t, e) {
          let r;
          const i = t / 8,
            s = new ArrayBuffer(i),
            o = new Uint8Array(s),
            w = -1 === e ? 3 : 0;
          for (r = 0; r < i; r += 1)
            o[r] = (n[r >>> 2] >>> (8 * (w + e * (r % 4)))) & 255;
          return s;
        })(n, e, r);
      };
    case 'UINT8ARRAY':
      try {
        new Uint8Array(0);
      } catch (n) {
        throw new Error('UINT8ARRAY not supported by this environment');
      }
      return function(n) {
        return (function(n, t, e) {
          let r;
          const i = t / 8,
            s = -1 === e ? 3 : 0,
            o = new Uint8Array(i);
          for (r = 0; r < i; r += 1)
            o[r] = (n[r >>> 2] >>> (8 * (s + e * (r % 4)))) & 255;
          return o;
        })(n, e, r);
      };
    default:
      throw new Error(
        'format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY'
      );
  }
}
