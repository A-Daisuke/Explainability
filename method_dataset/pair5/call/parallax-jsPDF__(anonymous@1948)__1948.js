function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    function s(e) {
      (this.isOpen = !1), (this.$element = null), (this.$parentNode = e);
    }
    var r = e("./lib/oop"),
      i = e("./lib/dom");
    (function() {
      (this.$init = function() {
        return (
          (this.$element = i.createElement("div")),
          (this.$element.className = "ace_tooltip"),
          (this.$element.style.display = "none"),
          this.$parentNode.appendChild(this.$element),
          this.$element
        );
      }),
        (this.getElement = function() {
          return this.$element || this.$init();
        }),
        (this.setText = function(e) {
          i.setInnerText(this.getElement(), e);
        }),
        (this.setHtml = function(e) {
          this.getElement().innerHTML = e;
        }),
        (this.setPosition = function(e, t) {
          (this.getElement().style.left = e + "px"),
            (this.getElement().style.top = t + "px");
        }),
        (this.setClassName = function(e) {
          i.addCssClass(this.getElement(), e);
        }),
        (this.show = function(e, t, n) {
          e != null && this.setText(e),
            t != null && n != null && this.setPosition(t, n),
            this.isOpen ||
              ((this.getElement().style.display = "block"), (this.isOpen = !0));
        }),
        (this.hide = function() {
          this.isOpen &&
            ((this.getElement().style.display = "none"), (this.isOpen = !1));
        }),
        (this.getHeight = function() {
          return this.getElement().offsetHeight;
        }),
        (this.getWidth = function() {
          return this.getElement().offsetWidth;
        });
    }.call(s.prototype),
      (t.Tooltip = s));
  }),

}
