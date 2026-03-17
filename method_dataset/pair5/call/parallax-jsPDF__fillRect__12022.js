function __method_wrapper__() {
    Context2D.prototype.fillRect = function (x, y, w, h) {
      if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
        console.error("jsPDF.context2d.fillRect: Invalid arguments", arguments);
        throw new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
      }
      if (isFillTransparent.call(this)) {
        return;
      }
      var tmp = {};
      if (this.lineCap !== "butt") {
        tmp.lineCap = this.lineCap;
        this.lineCap = "butt";
      }
      if (this.lineJoin !== "miter") {
        tmp.lineJoin = this.lineJoin;
        this.lineJoin = "miter";
      }
      this.beginPath();
      this.rect(x, y, w, h);
      this.fill();
      if (tmp.hasOwnProperty("lineCap")) {
        this.lineCap = tmp.lineCap;
      }
      if (tmp.hasOwnProperty("lineJoin")) {
        this.lineJoin = tmp.lineJoin;
      }
    };

}
