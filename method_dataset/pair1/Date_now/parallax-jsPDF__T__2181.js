      function T(e, n) {
        var r = Date.now(),
          i = !n || e.row != n.row,
          s = !n || e.column != n.column;
        if (!S || i || s)
          (t.$blockScrolling += 1),
            t.moveCursorToPosition(e),
            (t.$blockScrolling -= 1),
            (S = r),
            (x = { x: p, y: d });
        else {
          var o = l(x.x, x.y, p, d);
          o > a
            ? (S = null)
            : r - S >= u && (t.renderer.scrollCursorIntoView(), (S = null));
        }
      }
