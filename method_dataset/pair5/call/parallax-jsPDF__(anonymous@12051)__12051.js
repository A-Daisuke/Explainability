function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      i = e("./lib/dom"),
      s = e("./lib/event"),
      o = e("./lib/event_emitter").EventEmitter,
      u = 32768,
      a = function(e) {
        (this.element = i.createElement("div")),
          (this.element.className =
            "ace_scrollbar ace_scrollbar" + this.classSuffix),
          (this.inner = i.createElement("div")),
          (this.inner.className = "ace_scrollbar-inner"),
          this.element.appendChild(this.inner),
          e.appendChild(this.element),
          this.setVisible(!1),
          (this.skipEvent = !1),
          s.addListener(this.element, "scroll", this.onScroll.bind(this)),
          s.addListener(this.element, "mousedown", s.preventDefault);
      };
    (function() {
      r.implement(this, o),
        (this.setVisible = function(e) {
          (this.element.style.display = e ? "" : "none"),
            (this.isVisible = e),
            (this.coeff = 1);
        });
    }.call(a.prototype));
    var f = function(e, t) {
      a.call(this, e),
        (this.scrollTop = 0),
        (this.scrollHeight = 0),
        (t.$scrollbarWidth = this.width = i.scrollbarWidth(e.ownerDocument)),
        (this.inner.style.width = this.element.style.width =
          (this.width || 15) + 5 + "px");
    };
    r.inherits(f, a),
      function() {
        (this.classSuffix = "-v"),
          (this.onScroll = function() {
            if (!this.skipEvent) {
              this.scrollTop = this.element.scrollTop;
              if (this.coeff != 1) {
                var e = this.element.clientHeight / this.scrollHeight;
                this.scrollTop = (this.scrollTop * (1 - e)) / (this.coeff - e);
              }
              this._emit("scroll", { data: this.scrollTop });
            }
            this.skipEvent = !1;
          }),
          (this.getWidth = function() {
            return this.isVisible ? this.width : 0;
          }),
          (this.setHeight = function(e) {
            this.element.style.height = e + "px";
          }),
          (this.setInnerHeight = this.setScrollHeight = function(e) {
            (this.scrollHeight = e),
              e > u
                ? ((this.coeff = u / e), (e = u))
                : this.coeff != 1 && (this.coeff = 1),
              (this.inner.style.height = e + "px");
          }),
          (this.setScrollTop = function(e) {
            this.scrollTop != e &&
              ((this.skipEvent = !0),
              (this.scrollTop = e),
              (this.element.scrollTop = e * this.coeff));
          });
      }.call(f.prototype);
    var l = function(e, t) {
      a.call(this, e),
        (this.scrollLeft = 0),
        (this.height = t.$scrollbarWidth),
        (this.inner.style.height = this.element.style.height =
          (this.height || 15) + 5 + "px");
    };
    r.inherits(l, a),
      function() {
        (this.classSuffix = "-h"),
          (this.onScroll = function() {
            this.skipEvent ||
              ((this.scrollLeft = this.element.scrollLeft),
              this._emit("scroll", { data: this.scrollLeft })),
              (this.skipEvent = !1);
          }),
          (this.getHeight = function() {
            return this.isVisible ? this.height : 0;
          }),
          (this.setWidth = function(e) {
            this.element.style.width = e + "px";
          }),
          (this.setInnerWidth = function(e) {
            this.inner.style.width = e + "px";
          }),
          (this.setScrollWidth = function(e) {
            this.inner.style.width = e + "px";
          }),
          (this.setScrollLeft = function(e) {
            this.scrollLeft != e &&
              ((this.skipEvent = !0),
              (this.scrollLeft = this.element.scrollLeft = e));
          });
      }.call(l.prototype),
      (t.ScrollBar = f),
      (t.ScrollBarV = f),
      (t.ScrollBarH = l),
      (t.VScrollBar = f),
      (t.HScrollBar = l);
  }),

}
