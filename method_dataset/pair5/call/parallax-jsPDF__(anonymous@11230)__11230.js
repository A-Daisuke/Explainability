function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../range").Range,
      i = e("../lib/dom"),
      s = function(e) {
        (this.element = i.createElement("div")),
          (this.element.className = "ace_layer ace_marker-layer"),
          e.appendChild(this.element);
      };
    (function() {
      function e(e, t, n, r) {
        return (e ? 1 : 0) | (t ? 2 : 0) | (n ? 4 : 0) | (r ? 8 : 0);
      }
      (this.$padding = 0),
        (this.setPadding = function(e) {
          this.$padding = e;
        }),
        (this.setSession = function(e) {
          this.session = e;
        }),
        (this.setMarkers = function(e) {
          this.markers = e;
        }),
        (this.update = function(e) {
          var e = e || this.config;
          if (!e) return;
          this.config = e;
          var t = [];
          for (var n in this.markers) {
            var r = this.markers[n];
            if (!r.range) {
              r.update(t, this, this.session, e);
              continue;
            }
            var i = r.range.clipRows(e.firstRow, e.lastRow);
            if (i.isEmpty()) continue;
            i = i.toScreenRange(this.session);
            if (r.renderer) {
              var s = this.$getTop(i.start.row, e),
                o = this.$padding + i.start.column * e.characterWidth;
              r.renderer(t, i, o, s, e);
            } else
              r.type == "fullLine"
                ? this.drawFullLineMarker(t, i, r.clazz, e)
                : r.type == "screenLine"
                ? this.drawScreenLineMarker(t, i, r.clazz, e)
                : i.isMultiLine()
                ? r.type == "text"
                  ? this.drawTextMarker(t, i, r.clazz, e)
                  : this.drawMultiLineMarker(t, i, r.clazz, e)
                : this.drawSingleLineMarker(
                    t,
                    i,
                    r.clazz + " ace_start" + " ace_br15",
                    e
                  );
          }
          this.element.innerHTML = t.join("");
        }),
        (this.$getTop = function(e, t) {
          return (e - t.firstRowScreen) * t.lineHeight;
        }),
        (this.drawTextMarker = function(t, n, i, s, o) {
          var u = this.session,
            a = n.start.row,
            f = n.end.row,
            l = a,
            c = 0,
            h = 0,
            p = u.getScreenLastRowColumn(l),
            d = new r(l, n.start.column, l, h);
          for (; l <= f; l++)
            (d.start.row = d.end.row = l),
              (d.start.column =
                l == a ? n.start.column : u.getRowWrapIndent(l)),
              (d.end.column = p),
              (c = h),
              (h = p),
              (p =
                l + 1 < f
                  ? u.getScreenLastRowColumn(l + 1)
                  : l == f
                  ? 0
                  : n.end.column),
              this.drawSingleLineMarker(
                t,
                d,
                i +
                  (l == a ? " ace_start" : "") +
                  " ace_br" +
                  e(
                    l == a || (l == a + 1 && n.start.column),
                    c < h,
                    h > p,
                    l == f
                  ),
                s,
                l == f ? 0 : 1,
                o
              );
        }),
        (this.drawMultiLineMarker = function(e, t, n, r, i) {
          var s = this.$padding,
            o = r.lineHeight,
            u = this.$getTop(t.start.row, r),
            a = s + t.start.column * r.characterWidth;
          (i = i || ""),
            e.push(
              "<div class='",
              n,
              " ace_br1 ace_start' style='",
              "height:",
              o,
              "px;",
              "right:0;",
              "top:",
              u,
              "px;",
              "left:",
              a,
              "px;",
              i,
              "'></div>"
            ),
            (u = this.$getTop(t.end.row, r));
          var f = t.end.column * r.characterWidth;
          e.push(
            "<div class='",
            n,
            " ace_br12' style='",
            "height:",
            o,
            "px;",
            "width:",
            f,
            "px;",
            "top:",
            u,
            "px;",
            "left:",
            s,
            "px;",
            i,
            "'></div>"
          ),
            (o = (t.end.row - t.start.row - 1) * r.lineHeight);
          if (o <= 0) return;
          u = this.$getTop(t.start.row + 1, r);
          var l = (t.start.column ? 1 : 0) | (t.end.column ? 0 : 8);
          e.push(
            "<div class='",
            n,
            l ? " ace_br" + l : "",
            "' style='",
            "height:",
            o,
            "px;",
            "right:0;",
            "top:",
            u,
            "px;",
            "left:",
            s,
            "px;",
            i,
            "'></div>"
          );
        }),
        (this.drawSingleLineMarker = function(e, t, n, r, i, s) {
          var o = r.lineHeight,
            u = (t.end.column + (i || 0) - t.start.column) * r.characterWidth,
            a = this.$getTop(t.start.row, r),
            f = this.$padding + t.start.column * r.characterWidth;
          e.push(
            "<div class='",
            n,
            "' style='",
            "height:",
            o,
            "px;",
            "width:",
            u,
            "px;",
            "top:",
            a,
            "px;",
            "left:",
            f,
            "px;",
            s || "",
            "'></div>"
          );
        }),
        (this.drawFullLineMarker = function(e, t, n, r, i) {
          var s = this.$getTop(t.start.row, r),
            o = r.lineHeight;
          t.start.row != t.end.row && (o += this.$getTop(t.end.row, r) - s),
            e.push(
              "<div class='",
              n,
              "' style='",
              "height:",
              o,
              "px;",
              "top:",
              s,
              "px;",
              "left:0;right:0;",
              i || "",
              "'></div>"
            );
        }),
        (this.drawScreenLineMarker = function(e, t, n, r, i) {
          var s = this.$getTop(t.start.row, r),
            o = r.lineHeight;
          e.push(
            "<div class='",
            n,
            "' style='",
            "height:",
            o,
            "px;",
            "top:",
            s,
            "px;",
            "left:0;right:0;",
            i || "",
            "'></div>"
          );
        });
    }.call(s.prototype),
      (t.Marker = s));
  }),

}
