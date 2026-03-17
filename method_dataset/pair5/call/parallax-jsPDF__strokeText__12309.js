function __method_wrapper__() {
    Context2D.prototype.strokeText = function (text, x, y, maxWidth) {
      if (isNaN(x) || isNaN(y) || typeof text !== "string") {
        console.error("jsPDF.context2d.strokeText: Invalid arguments", arguments);
        throw new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
      }
      if (isStrokeTransparent.call(this)) {
        return;
      }
      maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
      var degs = rad2deg(this.ctx.transform.rotation);
      var scale = this.ctx.transform.scaleX;
      putText.call(this, {
        text: text,
        x: x,
        y: y,
        scale: scale,
        renderingMode: "stroke",
        angle: degs,
        align: this.textAlign,
        maxWidth: maxWidth
      });
    };

}
