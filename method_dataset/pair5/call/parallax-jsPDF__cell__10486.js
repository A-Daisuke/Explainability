    var cell = jsPDFAPI.cell = function () {
      var currentCell;
      if (arguments[0] instanceof Cell) {
        currentCell = arguments[0];
      } else {
        currentCell = new Cell(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      }
      _initialize.call(this);
      var lastCell = this.internal.__cell__.lastCell;
      var padding = this.internal.__cell__.padding;
      var margins = this.internal.__cell__.margins || NO_MARGINS;
      var tableHeaderRow = this.internal.__cell__.tableHeaderRow;
      var printHeaders = this.internal.__cell__.printHeaders;
      // If this is not the first cell, we must change its position
      if (typeof lastCell.lineNumber !== "undefined") {
        if (lastCell.lineNumber === currentCell.lineNumber) {
          //Same line
          currentCell.x = (lastCell.x || 0) + (lastCell.width || 0);
          currentCell.y = lastCell.y || 0;
        } else {
          //New line
          if (lastCell.y + lastCell.height + currentCell.height + margins.bottom > this.getPageHeight()) {
            this.cellAddPage();
            currentCell.y = margins.top;
            if (printHeaders && tableHeaderRow) {
              this.printHeaderRow(currentCell.lineNumber, true);
              currentCell.y += tableHeaderRow[0].height;
            }
          } else {
            currentCell.y = lastCell.y + lastCell.height || currentCell.y;
          }
        }
      }
      if (typeof currentCell.text[0] !== "undefined") {
        this.rect(currentCell.x, currentCell.y, currentCell.width, currentCell.height, printingHeaderRow === true ? "FD" : undefined);
        if (currentCell.align === "right") {
          this.text(currentCell.text, currentCell.x + currentCell.width - padding, currentCell.y + padding, {
            align: "right",
            baseline: "top"
          });
        } else if (currentCell.align === "center") {
          this.text(currentCell.text, currentCell.x + currentCell.width / 2, currentCell.y + padding, {
            align: "center",
            baseline: "top",
            maxWidth: currentCell.width - padding - padding
          });
        } else {
          this.text(currentCell.text, currentCell.x + padding, currentCell.y + padding, {
            align: "left",
            baseline: "top",
            maxWidth: currentCell.width - padding - padding
          });
        }
      }
      this.internal.__cell__.lastCell = currentCell;
      return this;
    };
