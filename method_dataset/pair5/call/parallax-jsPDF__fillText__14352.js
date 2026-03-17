function __method_wrapper__() {
  Context2D.prototype.fillText = function(text, x, y, maxWidth) {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.fillText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    }
    maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
    if (isFillTransparent.call(this)) {
      return;
    }

    var degs = rad2deg(this.ctx.transform.rotation);

    // We only use X axis as scale hint
    var scale = this.ctx.transform.scaleX;

    putText.call(this, {
      text: text,
      x: x,
      y: y,
      scale: scale,
      angle: degs,
      align: this.textAlign,
      maxWidth: maxWidth
    });
  };

}
