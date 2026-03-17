function e(e, r, i) {
  switch (r) {
    case 'UTF8':
    case 'UTF16BE':
    case 'UTF16LE':
      break;
    default:
      throw new Error('encoding must be UTF8, UTF16BE, or UTF16LE');
  }
  switch (e) {
    case 'HEX':
      return function(n, t, e) {
        return (function(n, t, e, r) {
          let i, s, o, w;
          if (0 != n.length % 2)
            throw new Error('String of HEX type must be in byte increments');
          const h = t || [0],
            u = (e = e || 0) >>> 3,
            c = -1 === r ? 3 : 0;
          for (i = 0; i < n.length; i += 2) {
            if (((s = parseInt(n.substr(i, 2), 16)), isNaN(s)))
              throw new Error('String of HEX type contains invalid characters');
            for (w = (i >>> 1) + u, o = w >>> 2; h.length <= o; ) h.push(0);
            h[o] |= s << (8 * (c + r * (w % 4)));
          }
          return { value: h, binLen: 4 * n.length + e };
        })(n, t, e, i);
      };
    case 'TEXT':
      return function(n, t, e) {
        return (function(n, t, e, r, i) {
          let s,
            o,
            w,
            h,
            u,
            c,
            f,
            a,
            l = 0;
          const A = e || [0],
            E = (r = r || 0) >>> 3;
          if ('UTF8' === t)
            for (f = -1 === i ? 3 : 0, w = 0; w < n.length; w += 1)
              for (
                s = n.charCodeAt(w),
                  o = [],
                  128 > s
                    ? o.push(s)
                    : 2048 > s
                    ? (o.push(192 | (s >>> 6)), o.push(128 | (63 & s)))
                    : 55296 > s || 57344 <= s
                    ? o.push(
                        224 | (s >>> 12),
                        128 | ((s >>> 6) & 63),
                        128 | (63 & s)
                      )
                    : ((w += 1),
                      (s =
                        65536 +
                        (((1023 & s) << 10) | (1023 & n.charCodeAt(w)))),
                      o.push(
                        240 | (s >>> 18),
                        128 | ((s >>> 12) & 63),
                        128 | ((s >>> 6) & 63),
                        128 | (63 & s)
                      )),
                  h = 0;
                h < o.length;
                h += 1
              ) {
                for (c = l + E, u = c >>> 2; A.length <= u; ) A.push(0);
                (A[u] |= o[h] << (8 * (f + i * (c % 4)))), (l += 1);
              }
          else
            for (
              f = -1 === i ? 2 : 0,
                a =
                  ('UTF16LE' === t && 1 !== i) || ('UTF16LE' !== t && 1 === i),
                w = 0;
              w < n.length;
              w += 1
            ) {
              for (
                s = n.charCodeAt(w),
                  !0 === a && ((h = 255 & s), (s = (h << 8) | (s >>> 8))),
                  c = l + E,
                  u = c >>> 2;
                A.length <= u;

              )
                A.push(0);
              (A[u] |= s << (8 * (f + i * (c % 4)))), (l += 2);
            }
          return { value: A, binLen: 8 * l + r };
        })(n, r, t, e, i);
      };
    case 'B64':
      return function(t, e, r) {
        return (function(t, e, r, i) {
          let s,
            o,
            w,
            h,
            u,
            c,
            f,
            a = 0;
          const l = e || [0],
            A = (r = r || 0) >>> 3,
            E = -1 === i ? 3 : 0,
            p = t.indexOf('=');
          if (-1 === t.search(/^[a-zA-Z0-9=+/]+$/))
            throw new Error('Invalid character in base-64 string');
          if (((t = t.replace(/=/g, '')), -1 !== p && p < t.length))
            throw new Error("Invalid '=' found in base-64 string");
          for (o = 0; o < t.length; o += 4) {
            for (u = t.substr(o, 4), h = 0, w = 0; w < u.length; w += 1)
              (s = n.indexOf(u.charAt(w))), (h |= s << (18 - 6 * w));
            for (w = 0; w < u.length - 1; w += 1) {
              for (f = a + A, c = f >>> 2; l.length <= c; ) l.push(0);
              (l[c] |= ((h >>> (16 - 8 * w)) & 255) << (8 * (E + i * (f % 4)))),
                (a += 1);
            }
          }
          return { value: l, binLen: 8 * a + r };
        })(t, e, r, i);
      };
    case 'BYTES':
      return function(n, t, e) {
        return (function(n, t, e, r) {
          let i, s, o, w;
          const h = t || [0],
            u = (e = e || 0) >>> 3,
            c = -1 === r ? 3 : 0;
          for (s = 0; s < n.length; s += 1)
            (i = n.charCodeAt(s)),
              (w = s + u),
              (o = w >>> 2),
              h.length <= o && h.push(0),
              (h[o] |= i << (8 * (c + r * (w % 4))));
          return { value: h, binLen: 8 * n.length + e };
        })(n, t, e, i);
      };
    case 'ARRAYBUFFER':
      try {
        new ArrayBuffer(0);
      } catch (n) {
        throw new Error('ARRAYBUFFER not supported by this environment');
      }
      return function(n, e, r) {
        return (function(n, e, r, i) {
          return t(new Uint8Array(n), e, r, i);
        })(n, e, r, i);
      };
    case 'UINT8ARRAY':
      try {
        new Uint8Array(0);
      } catch (n) {
        throw new Error('UINT8ARRAY not supported by this environment');
      }
      return function(n, e, r) {
        return t(n, e, r, i);
      };
    default:
      throw new Error(
        'format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY'
      );
  }
}
