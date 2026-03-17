function __method_wrapper__() {
  jsPDFAPI.printHeaderRow = function(lineNumber, new_page) {
    _initialize.call(this);
    if (!this.internal.__cell__.tableHeaderRow) {
      throw new Error("Property tableHeaderRow does not exist.");
    }

    var tableHeaderCell;

    printingHeaderRow = true;
    if (typeof this.internal.__cell__.headerFunction === "function") {
      var position = this.internal.__cell__.headerFunction(
        this,
        this.internal.__cell__.pages
      );
      this.internal.__cell__.lastCell = new Cell(
        position[0],
        position[1],
        position[2],
        position[3],
        undefined,
        -1
      );
    }
    this.setFont(undefined, "bold");

    var tempHeaderConf = [];
    for (var i = 0; i < this.internal.__cell__.tableHeaderRow.length; i += 1) {
      tableHeaderCell = this.internal.__cell__.tableHeaderRow[i].clone();
      if (new_page) {
        tableHeaderCell.y = this.internal.__cell__.margins.top || 0;
        tempHeaderConf.push(tableHeaderCell);
      }
      tableHeaderCell.lineNumber = lineNumber;
      var currentTextColor = this.getTextColor();
      this.setTextColor(this.internal.__cell__.headerTextColor);
      this.setFillColor(this.internal.__cell__.headerBackgroundColor);
      cell.call(this, tableHeaderCell);
      this.setTextColor(currentTextColor);
    }
    if (tempHeaderConf.length > 0) {
      this.setTableHeaderRow(tempHeaderConf);
    }
    this.setFont(undefined, "normal");
    printingHeaderRow = false;
  };

}
