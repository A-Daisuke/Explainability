function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    function u(e) {
      function l() {
        var r = u.getDocumentPosition().row,
          s = n.$annotations[r];
        if (!s) return c();
        var o = t.session.getLength();
        if (r == o) {
          var a = t.renderer.pixelToScreenCoordinates(0, u.y).row,
            l = u.$pos;
          if (a > t.session.documentToScreenRow(l.row, l.column)) return c();
        }
        if (f == s) return;
        (f = s.text.join("<br/>")),
          i.setHtml(f),
          i.show(),
          t._signal("showGutterTooltip", i),
          t.on("mousewheel", c);
        if (e.$tooltipFollowsMouse) h(u);
        else {
          var p = u.domEvent.target,
            d = p.getBoundingClientRect(),
            v = i.getElement().style;
          (v.left = d.right + "px"), (v.top = d.bottom + "px");
        }
      }
      function c() {
        o && (o = clearTimeout(o)),
          f &&
            (i.hide(),
            (f = null),
            t._signal("hideGutterTooltip", i),
            t.removeEventListener("mousewheel", c));
      }
      function h(e) {
        i.setPosition(e.x, e.y);
      }
      var t = e.editor,
        n = t.renderer.$gutterLayer,
        i = new a(t.container);
      e.editor.setDefaultHandler("guttermousedown", function(r) {
        if (!t.isFocused() || r.getButton() != 0) return;
        var i = n.getRegion(r);
        if (i == "foldWidgets") return;
        var s = r.getDocumentPosition().row,
          o = t.session.selection;
        if (r.getShiftKey()) o.selectTo(s, 0);
        else {
          if (r.domEvent.detail == 2) return t.selectAll(), r.preventDefault();
          e.$clickSelection = t.selection.getLineRange(s);
        }
        return (
          e.setState("selectByLines"), e.captureMouse(r), r.preventDefault()
        );
      });
      var o, u, f;
      e.editor.setDefaultHandler("guttermousemove", function(t) {
        var n = t.domEvent.target || t.domEvent.srcElement;
        if (r.hasCssClass(n, "ace_fold-widget")) return c();
        f && e.$tooltipFollowsMouse && h(t), (u = t);
        if (o) return;
        o = setTimeout(function() {
          (o = null), u && !e.isMousePressed ? l() : c();
        }, 50);
      }),
        s.addListener(t.renderer.$gutter, "mouseout", function(e) {
          u = null;
          if (!f || o) return;
          o = setTimeout(function() {
            (o = null), c();
          }, 50);
        }),
        t.on("changeSession", c);
    }
    function a(e) {
      o.call(this, e);
    }
    var r = e("../lib/dom"),
      i = e("../lib/oop"),
      s = e("../lib/event"),
      o = e("../tooltip").Tooltip;
    i.inherits(a, o),
      function() {
        this.setPosition = function(e, t) {
          var n = window.innerWidth || document.documentElement.clientWidth,
            r = window.innerHeight || document.documentElement.clientHeight,
            i = this.getWidth(),
            s = this.getHeight();
          (e += 15),
            (t += 15),
            e + i > n && (e -= e + i - n),
            t + s > r && (t -= 20 + s),
            o.prototype.setPosition.call(this, e, t);
        };
      }.call(a.prototype),
      (t.GutterHandler = u);
  }),

}
