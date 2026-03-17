function __method_wrapper__() {
    jsPDFAPI.table = function (x, y, data, headers, config) {
      _initialize.call(this);
      if (!data) {
        throw new Error("No data for PDF table.");
      }
      config = config || {};
      var headerNames = [],
        headerLabels = [],
        headerAligns = [],
        i,
        columnMatrix = {},
        columnWidths = {},
        column,
        columnMinWidths = [],
        j,
        tableHeaderConfigs = [],
        //set up defaults. If a value is provided in config, defaults will be overwritten:
        autoSize = config.autoSize || false,
        printHeaders = config.printHeaders === false ? false : true,
        fontSize = config.css && typeof config.css["font-size"] !== "undefined" ? config.css["font-size"] * 16 : config.fontSize || 12,
        margins = config.margins || Object.assign({
          width: this.getPageWidth()
        }, NO_MARGINS),
        padding = typeof config.padding === "number" ? config.padding : 3,
        headerBackgroundColor = config.headerBackgroundColor || "#c8c8c8",
        headerTextColor = config.headerTextColor || "#000";
      _reset.call(this);
      this.internal.__cell__.printHeaders = printHeaders;
      this.internal.__cell__.margins = margins;
      this.internal.__cell__.table_font_size = fontSize;
      this.internal.__cell__.padding = padding;
      this.internal.__cell__.headerBackgroundColor = headerBackgroundColor;
      this.internal.__cell__.headerTextColor = headerTextColor;
      this.setFontSize(fontSize);

      // Set header values
      if (headers === undefined || headers === null) {
        // No headers defined so we derive from data
        headerNames = Object.keys(data[0]);
        headerLabels = headerNames;
        headerAligns = headerNames.map(function () {
          return "left";
        });
      } else if (Array.isArray(headers) && _typeof(headers[0]) === "object") {
        headerNames = headers.map(function (header) {
          return header.name;
        });
        headerLabels = headers.map(function (header) {
          return header.prompt || header.name || "";
        });
        headerAligns = headers.map(function (header) {
          return header.align || "left";
        });
        // Split header configs into names and prompts
        for (i = 0; i < headers.length; i += 1) {
          columnWidths[headers[i].name] = headers[i].width * px2pt;
        }
      } else if (Array.isArray(headers) && typeof headers[0] === "string") {
        headerNames = headers;
        headerLabels = headerNames;
        headerAligns = headerNames.map(function () {
          return "left";
        });
      }
      if (autoSize || Array.isArray(headers) && typeof headers[0] === "string") {
        var headerName;
        for (i = 0; i < headerNames.length; i += 1) {
          headerName = headerNames[i];

          // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}

          columnMatrix[headerName] = data.map(function (rec) {
            return rec[headerName];
          });

          // get header width
          this.setFont(undefined, "bold");
          columnMinWidths.push(this.getTextDimensions(headerLabels[i], {
            fontSize: this.internal.__cell__.table_font_size,
            scaleFactor: this.internal.scaleFactor
          }).w);
          column = columnMatrix[headerName];

          // get cell widths
          this.setFont(undefined, "normal");
          for (j = 0; j < column.length; j += 1) {
            columnMinWidths.push(this.getTextDimensions(column[j], {
              fontSize: this.internal.__cell__.table_font_size,
              scaleFactor: this.internal.scaleFactor
            }).w);
          }

          // get final column width
          columnWidths[headerName] = Math.max.apply(null, columnMinWidths) + padding + padding;

          //have to reset
          columnMinWidths = [];
        }
      }

      // -- Construct the table

      if (printHeaders) {
        var row = {};
        for (i = 0; i < headerNames.length; i += 1) {
          row[headerNames[i]] = {};
          row[headerNames[i]].text = headerLabels[i];
          row[headerNames[i]].align = headerAligns[i];
        }
        var rowHeight = calculateLineHeight.call(this, row, columnWidths);

        // Construct the header row
        tableHeaderConfigs = headerNames.map(function (value) {
          return new Cell(x, y, columnWidths[value], rowHeight, row[value].text, undefined, row[value].align);
        });

        // Store the table header config
        this.setTableHeaderRow(tableHeaderConfigs);

        // Print the header for the start of the table
        this.printHeaderRow(1, false);
      }

      // Construct the data rows

      var align = headers.reduce(function (pv, cv) {
        pv[cv.name] = cv.align;
        return pv;
      }, {});
      for (i = 0; i < data.length; i += 1) {
        if ("rowStart" in config && config.rowStart instanceof Function) {
          config.rowStart({
            row: i,
            data: data[i]
          }, this);
        }
        var lineHeight = calculateLineHeight.call(this, data[i], columnWidths);
        for (j = 0; j < headerNames.length; j += 1) {
          var cellData = data[i][headerNames[j]];
          if ("cellStart" in config && config.cellStart instanceof Function) {
            config.cellStart({
              row: i,
              col: j,
              data: cellData
            }, this);
          }
          cell.call(this, new Cell(x, y, columnWidths[headerNames[j]], lineHeight, cellData, i + 2, align[headerNames[j]]));
        }
      }
      this.internal.__cell__.table_x = x;
      this.internal.__cell__.table_y = y;
      return this;
    };

}
