  var ASCII85Encode = function(a) {
    var b, c, d, e, f, g, h, i, j, k;
    // eslint-disable-next-line no-control-regex
    for (
      !/[^\x00-\xFF]/.test(a),
        b = "\x00\x00\x00\x00".slice(a.length % 4 || 4),
        a += b,
        c = [],
        d = 0,
        e = a.length;
      e > d;
      d += 4
    )
      (f =
        (a.charCodeAt(d) << 24) +
        (a.charCodeAt(d + 1) << 16) +
        (a.charCodeAt(d + 2) << 8) +
        a.charCodeAt(d + 3)),
        0 !== f
          ? ((k = f % 85),
            (f = (f - k) / 85),
            (j = f % 85),
            (f = (f - j) / 85),
            (i = f % 85),
            (f = (f - i) / 85),
            (h = f % 85),
            (f = (f - h) / 85),
            (g = f % 85),
            c.push(g + 33, h + 33, i + 33, j + 33, k + 33))
          : c.push(122);
    return (
      (function(a, b) {
        for (var c = b; c > 0; c--) a.pop();
      })(c, b.length),
      String.fromCharCode.apply(String, c) + "~>"
    );
  };
