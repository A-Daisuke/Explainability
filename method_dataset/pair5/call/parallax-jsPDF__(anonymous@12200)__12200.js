function __method_wrapper__() {
  ], function(e, t, n) {
    var r = e("../lib/oop"),
      i = e("../lib/dom"),
      s = e("../lib/lang"),
      o = e("../lib/useragent"),
      u = e("../lib/event_emitter").EventEmitter,
      a = 0,
      f = (t.FontMetrics = function(e) {
        (this.el = i.createElement("div")),
          this.$setMeasureNodeStyles(this.el.style, !0),
          (this.$main = i.createElement("div")),
          this.$setMeasureNodeStyles(this.$main.style),
          (this.$measureNode = i.createElement("div")),
          this.$setMeasureNodeStyles(this.$measureNode.style),
          this.el.appendChild(this.$main),
          this.el.appendChild(this.$measureNode),
          e.appendChild(this.el),
          a || this.$testFractionalRect(),
          (this.$measureNode.innerHTML = s.stringRepeat("X", a)),
          (this.$characterSize = { width: 0, height: 0 }),
          this.checkForSizeChanges();
      });
    (function() {
      r.implement(this, u),
        (this.$characterSize = { width: 0, height: 0 }),
        (this.$testFractionalRect = function() {
          var e = i.createElement("div");
          this.$setMeasureNodeStyles(e.style),
            (e.style.width = "0.2px"),
            document.documentElement.appendChild(e);
          var t = e.getBoundingClientRect().width;
          t > 0 && t < 1 ? (a = 50) : (a = 100), e.parentNode.removeChild(e);
        }),
        (this.$setMeasureNodeStyles = function(e, t) {
          (e.width = e.height = "auto"),
            (e.left = e.top = "0px"),
            (e.visibility = "hidden"),
            (e.position = "absolute"),
            (e.whiteSpace = "pre"),
            (e.font = "inherit"),
            (e.overflow = t ? "hidden" : "visible");
        }),
        (this.checkForSizeChanges = function() {
          var e = this.$measureSizes();
          if (
            e &&
            (this.$characterSize.width !== e.width ||
              this.$characterSize.height !== e.height)
          ) {
            this.$measureNode.style.fontWeight = "bold";
            var t = this.$measureSizes();
            (this.$measureNode.style.fontWeight = ""),
              (this.$characterSize = e),
              (this.charSizes = Object.create(null)),
              (this.allowBoldFonts =
                t && t.width === e.width && t.height === e.height),
              this._emit("changeCharacterSize", { data: e });
          }
        }),
        (this.$pollSizeChanges = function() {
          if (this.$pollSizeChangesTimer) return this.$pollSizeChangesTimer;
          var e = this;
          return (this.$pollSizeChangesTimer = setInterval(function() {
            e.checkForSizeChanges();
          }, 500));
        }),
        (this.setPolling = function(e) {
          e
            ? this.$pollSizeChanges()
            : this.$pollSizeChangesTimer &&
              (clearInterval(this.$pollSizeChangesTimer),
              (this.$pollSizeChangesTimer = 0));
        }),
        (this.$measureSizes = function() {
          if (a === 50) {
            var e = null;
            try {
              e = this.$measureNode.getBoundingClientRect();
            } catch (t) {
              e = { width: 0, height: 0 };
            }
            var n = { height: e.height, width: e.width / a };
          } else
            var n = {
              height: this.$measureNode.clientHeight,
              width: this.$measureNode.clientWidth / a
            };
          return n.width === 0 || n.height === 0 ? null : n;
        }),
        (this.$measureCharWidth = function(e) {
          this.$main.innerHTML = s.stringRepeat(e, a);
          var t = this.$main.getBoundingClientRect();
          return t.width / a;
        }),
        (this.getCharacterWidth = function(e) {
          var t = this.charSizes[e];
          return (
            t === undefined &&
              (t = this.charSizes[e] =
                this.$measureCharWidth(e) / this.$characterSize.width),
            t
          );
        }),
        (this.destroy = function() {
          clearInterval(this.$pollSizeChangesTimer),
            this.el &&
              this.el.parentNode &&
              this.el.parentNode.removeChild(this.el);
        });
    }.call(f.prototype));
  }),

}
