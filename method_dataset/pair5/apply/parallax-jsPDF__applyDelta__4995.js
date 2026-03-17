function __method_wrapper__() {
    t.applyDelta = function(e, t, n) {
      var r = t.start.row,
        i = t.start.column,
        s = e[r] || "";
      switch (t.action) {
        case "insert":
          var o = t.lines;
          if (o.length === 1)
            e[r] = s.substring(0, i) + t.lines[0] + s.substring(i);
          else {
            var u = [r, 1].concat(t.lines);
            e.splice.apply(e, u),
              (e[r] = s.substring(0, i) + e[r]),
              (e[r + t.lines.length - 1] += s.substring(i));
          }
          break;
        case "remove":
          var a = t.end.column,
            f = t.end.row;
          r === f
            ? (e[r] = s.substring(0, i) + s.substring(a))
            : e.splice(r, f - r + 1, s.substring(0, i) + e[f].substring(a));
      }
    };

}
