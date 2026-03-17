      function N(e, n) {
        var r = Date.now(),
          i = t.renderer.layerConfig.lineHeight,
          s = t.renderer.layerConfig.characterWidth,
          u = t.renderer.scroller.getBoundingClientRect(),
          a = {
            x: { left: p - u.left, right: u.right - p },
            y: { top: d - u.top, bottom: u.bottom - d }
          },
          f = Math.min(a.x.left, a.x.right),
          l = Math.min(a.y.top, a.y.bottom),
          c = { row: e.row, column: e.column };
        f / s <= 2 && (c.column += a.x.left < a.x.right ? -3 : 2),
          l / i <= 1 && (c.row += a.y.top < a.y.bottom ? -1 : 1);
        var h = e.row != c.row,
          v = e.column != c.column,
          m = !n || e.row != n.row;
        h || (v && !m)
          ? E
            ? r - E >= o && t.renderer.scrollCursorIntoView(c)
            : (E = r)
          : (E = null);
      }
