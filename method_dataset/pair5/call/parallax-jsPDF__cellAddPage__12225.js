function __method_wrapper__() {
  jsPDFAPI.cellAddPage = function() {
    _initialize.call(this);

    this.addPage();

    var margins = this.internal.__cell__.margins || NO_MARGINS;
    this.internal.__cell__.lastCell = new Cell(
      margins.left,
      margins.top,
      undefined,
      undefined
    );
    this.internal.__cell__.pages += 1;

    return this;
  };

}
