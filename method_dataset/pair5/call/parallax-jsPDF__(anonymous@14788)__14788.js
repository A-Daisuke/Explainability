function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    function o(e) {
      (this.session = e),
        (this.session.widgetManager = this),
        (this.session.getRowLength = this.getRowLength),
        (this.session.$getWidgetScreenLength = this.$getWidgetScreenLength),
        (this.updateOnChange = this.updateOnChange.bind(this)),
        (this.renderWidgets = this.renderWidgets.bind(this)),
        (this.measureWidgets = this.measureWidgets.bind(this)),
        (this.session._changedWidgets = []),
        (this.$onChangeEditor = this.$onChangeEditor.bind(this)),
        this.session.on("change", this.updateOnChange),
        this.session.on("changeFold", this.updateOnFold),
        this.session.on("changeEditor", this.$onChangeEditor);
    }
    var r = e("./lib/oop"),
      i = e("./lib/dom"),
      s = e("./range").Range;
    (function() {
      (this.getRowLength = function(e) {
        var t;
        return (
          this.lineWidgets
            ? (t = (this.lineWidgets[e] && this.lineWidgets[e].rowCount) || 0)
            : (t = 0),
          !this.$useWrapMode || !this.$wrapData[e]
            ? 1 + t
            : this.$wrapData[e].length + 1 + t
        );
      }),
        (this.$getWidgetScreenLength = function() {
          var e = 0;
          return (
            this.lineWidgets.forEach(function(t) {
              t && t.rowCount && !t.hidden && (e += t.rowCount);
            }),
            e
          );
        }),
        (this.$onChangeEditor = function(e) {
          this.attach(e.editor);
        }),
        (this.attach = function(e) {
          e &&
            e.widgetManager &&
            e.widgetManager != this &&
            e.widgetManager.detach();
          if (this.editor == e) return;
          this.detach(),
            (this.editor = e),
            e &&
              ((e.widgetManager = this),
              e.renderer.on("beforeRender", this.measureWidgets),
              e.renderer.on("afterRender", this.renderWidgets));
        }),
        (this.detach = function(e) {
          var t = this.editor;
          if (!t) return;
          (this.editor = null),
            (t.widgetManager = null),
            t.renderer.off("beforeRender", this.measureWidgets),
            t.renderer.off("afterRender", this.renderWidgets);
          var n = this.session.lineWidgets;
          n &&
            n.forEach(function(e) {
              e &&
                e.el &&
                e.el.parentNode &&
                ((e._inDocument = !1), e.el.parentNode.removeChild(e.el));
            });
        }),
        (this.updateOnFold = function(e, t) {
          var n = t.lineWidgets;
          if (!n || !e.action) return;
          var r = e.data,
            i = r.start.row,
            s = r.end.row,
            o = e.action == "add";
          for (var u = i + 1; u < s; u++) n[u] && (n[u].hidden = o);
          n[s] &&
            (o
              ? n[i]
                ? (n[s].hidden = o)
                : (n[i] = n[s])
              : (n[i] == n[s] && (n[i] = undefined), (n[s].hidden = o)));
        }),
        (this.updateOnChange = function(e) {
          var t = this.session.lineWidgets;
          if (!t) return;
          var n = e.start.row,
            r = e.end.row - n;
          if (r !== 0)
            if (e.action == "remove") {
              var i = t.splice(n + 1, r);
              i.forEach(function(e) {
                e && this.removeLineWidget(e);
              }, this),
                this.$updateRows();
            } else {
              var s = new Array(r);
              s.unshift(n, 0), t.splice.apply(t, s), this.$updateRows();
            }
        }),
        (this.$updateRows = function() {
          var e = this.session.lineWidgets;
          if (!e) return;
          var t = !0;
          e.forEach(function(e, n) {
            if (e) {
              (t = !1), (e.row = n);
              while (e.$oldWidget) (e.$oldWidget.row = n), (e = e.$oldWidget);
            }
          }),
            t && (this.session.lineWidgets = null);
        }),
        (this.addLineWidget = function(e) {
          this.session.lineWidgets ||
            (this.session.lineWidgets = new Array(this.session.getLength()));
          var t = this.session.lineWidgets[e.row];
          t &&
            ((e.$oldWidget = t),
            t.el &&
              t.el.parentNode &&
              (t.el.parentNode.removeChild(t.el), (t._inDocument = !1))),
            (this.session.lineWidgets[e.row] = e),
            (e.session = this.session);
          var n = this.editor.renderer;
          e.html &&
            !e.el &&
            ((e.el = i.createElement("div")), (e.el.innerHTML = e.html)),
            e.el &&
              (i.addCssClass(e.el, "ace_lineWidgetContainer"),
              (e.el.style.position = "absolute"),
              (e.el.style.zIndex = 5),
              n.container.appendChild(e.el),
              (e._inDocument = !0)),
            e.coverGutter || (e.el.style.zIndex = 3),
            e.pixelHeight == null && (e.pixelHeight = e.el.offsetHeight),
            e.rowCount == null &&
              (e.rowCount = e.pixelHeight / n.layerConfig.lineHeight);
          var r = this.session.getFoldAt(e.row, 0);
          e.$fold = r;
          if (r) {
            var s = this.session.lineWidgets;
            e.row == r.end.row && !s[r.start.row]
              ? (s[r.start.row] = e)
              : (e.hidden = !0);
          }
          return (
            this.session._emit("changeFold", {
              data: { start: { row: e.row } }
            }),
            this.$updateRows(),
            this.renderWidgets(null, n),
            this.onWidgetChanged(e),
            e
          );
        }),
        (this.removeLineWidget = function(e) {
          (e._inDocument = !1),
            (e.session = null),
            e.el && e.el.parentNode && e.el.parentNode.removeChild(e.el);
          if (e.editor && e.editor.destroy)
            try {
              e.editor.destroy();
            } catch (t) {}
          if (this.session.lineWidgets) {
            var n = this.session.lineWidgets[e.row];
            if (n == e)
              (this.session.lineWidgets[e.row] = e.$oldWidget),
                e.$oldWidget && this.onWidgetChanged(e.$oldWidget);
            else
              while (n) {
                if (n.$oldWidget == e) {
                  n.$oldWidget = e.$oldWidget;
                  break;
                }
                n = n.$oldWidget;
              }
          }
          this.session._emit("changeFold", { data: { start: { row: e.row } } }),
            this.$updateRows();
        }),
        (this.getWidgetsAtRow = function(e) {
          var t = this.session.lineWidgets,
            n = t && t[e],
            r = [];
          while (n) r.push(n), (n = n.$oldWidget);
          return r;
        }),
        (this.onWidgetChanged = function(e) {
          this.session._changedWidgets.push(e),
            this.editor && this.editor.renderer.updateFull();
        }),
        (this.measureWidgets = function(e, t) {
          var n = this.session._changedWidgets,
            r = t.layerConfig;
          if (!n || !n.length) return;
          var i = Infinity;
          for (var s = 0; s < n.length; s++) {
            var o = n[s];
            if (!o || !o.el) continue;
            if (o.session != this.session) continue;
            if (!o._inDocument) {
              if (this.session.lineWidgets[o.row] != o) continue;
              (o._inDocument = !0), t.container.appendChild(o.el);
            }
            (o.h = o.el.offsetHeight),
              o.fixedWidth ||
                ((o.w = o.el.offsetWidth),
                (o.screenWidth = Math.ceil(o.w / r.characterWidth)));
            var u = o.h / r.lineHeight;
            o.coverLine &&
              ((u -= this.session.getRowLineCount(o.row)), u < 0 && (u = 0)),
              o.rowCount != u && ((o.rowCount = u), o.row < i && (i = o.row));
          }
          i != Infinity &&
            (this.session._emit("changeFold", { data: { start: { row: i } } }),
            (this.session.lineWidgetWidth = null)),
            (this.session._changedWidgets = []);
        }),
        (this.renderWidgets = function(e, t) {
          var n = t.layerConfig,
            r = this.session.lineWidgets;
          if (!r) return;
          var i = Math.min(this.firstRow, n.firstRow),
            s = Math.max(this.lastRow, n.lastRow, r.length);
          while (i > 0 && !r[i]) i--;
          (this.firstRow = n.firstRow),
            (this.lastRow = n.lastRow),
            (t.$cursorLayer.config = n);
          for (var o = i; o <= s; o++) {
            var u = r[o];
            if (!u || !u.el) continue;
            if (u.hidden) {
              u.el.style.top = -100 - (u.pixelHeight || 0) + "px";
              continue;
            }
            u._inDocument ||
              ((u._inDocument = !0), t.container.appendChild(u.el));
            var a = t.$cursorLayer.getPixelPosition({ row: o, column: 0 }, !0)
              .top;
            u.coverLine ||
              (a += n.lineHeight * this.session.getRowLineCount(u.row)),
              (u.el.style.top = a - n.offset + "px");
            var f = u.coverGutter ? 0 : t.gutterWidth;
            u.fixedWidth || (f -= t.scrollLeft),
              (u.el.style.left = f + "px"),
              u.fullWidth &&
                u.screenWidth &&
                (u.el.style.minWidth = n.width + 2 * n.padding + "px"),
              u.fixedWidth
                ? (u.el.style.right = t.scrollBar.getWidth() + "px")
                : (u.el.style.right = "");
          }
        });
    }.call(o.prototype),
      (t.LineWidgets = o));
  }),

}
