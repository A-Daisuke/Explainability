function __method_wrapper__() {
  Canvas.prototype.getContext = function(contextType, contextAttributes) {
    contextType = contextType || "2d";
    var key;

    if (contextType !== "2d") {
      return null;
    }
    for (key in contextAttributes) {
      if (this.pdf.context2d.hasOwnProperty(key)) {
        this.pdf.context2d[key] = contextAttributes[key];
      }
    }
    this.pdf.context2d._canvas = this;
    return this.pdf.context2d;
  };

}
