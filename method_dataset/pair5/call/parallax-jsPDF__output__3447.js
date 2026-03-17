    var output = API.output = API.__private__.output = SAFE(function output(type, options) {
      options = options || {};
      if (typeof options === "string") {
        options = {
          filename: options
        };
      } else {
        options.filename = options.filename || "generated.pdf";
      }
      switch (type) {
        case undefined:
          return buildDocument();
        case "save":
          API.save(options.filename);
          break;
        case "arraybuffer":
          return getArrayBuffer(buildDocument());
        case "blob":
          return getBlob(buildDocument());
        case "bloburi":
        case "bloburl":
          // Developer is responsible of calling revokeObjectURL
          if (typeof globalObject.URL !== "undefined" && typeof globalObject.URL.createObjectURL === "function") {
            return globalObject.URL && globalObject.URL.createObjectURL(getBlob(buildDocument())) || void 0;
          } else {
            console.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");
          }
          break;
        case "datauristring":
        case "dataurlstring":
          var dataURI = "";
          var pdfDocument = buildDocument();
          try {
            dataURI = btoa(pdfDocument);
          } catch (e) {
            dataURI = btoa(unescape(encodeURIComponent(pdfDocument)));
          }
          return "data:application/pdf;filename=" + options.filename + ";base64," + dataURI;
        case "pdfobjectnewwindow":
          if (Object.prototype.toString.call(globalObject) === "[object Window]") {
            var pdfObjectUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js";
            var integrity = ' integrity="sha512-4ze/a9/4jqu+tX9dfOqJYSvyYd5M6qum/3HpCLr+/Jqf0whc37VUbkpNGHR7/8pSnCFw47T1fmIpwBV7UySh3g==" crossorigin="anonymous"';
            if (options.pdfObjectUrl) {
              pdfObjectUrl = options.pdfObjectUrl;
              integrity = "";
            }
            var htmlForNewWindow = "<html>" + '<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="' + pdfObjectUrl + '"' + integrity + '></script><script >PDFObject.embed("' + this.output("dataurlstring") + '", ' + JSON.stringify(options) + ");</script></body></html>";
            var nW = globalObject.open();
            if (nW !== null) {
              nW.document.write(htmlForNewWindow);
            }
            return nW;
          } else {
            throw new Error("The option pdfobjectnewwindow just works in a browser-environment.");
          }
        case "pdfjsnewwindow":
          if (Object.prototype.toString.call(globalObject) === "[object Window]") {
            var pdfJsUrl = options.pdfJsUrl || "examples/PDF.js/web/viewer.html";
            var htmlForPDFjsNewWindow = "<html>" + "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" + '<body><iframe id="pdfViewer" src="' + pdfJsUrl + "?file=&downloadName=" + options.filename + '" width="500px" height="400px" />' + "</body></html>";
            var PDFjsNewWindow = globalObject.open();
            if (PDFjsNewWindow !== null) {
              PDFjsNewWindow.document.write(htmlForPDFjsNewWindow);
              var scope = this;
              PDFjsNewWindow.document.documentElement.querySelector("#pdfViewer").onload = function () {
                PDFjsNewWindow.document.title = options.filename;
                PDFjsNewWindow.document.documentElement.querySelector("#pdfViewer").contentWindow.PDFViewerApplication.open(scope.output("bloburl"));
              };
            }
            return PDFjsNewWindow;
          } else {
            throw new Error("The option pdfjsnewwindow just works in a browser-environment.");
          }
        case "dataurlnewwindow":
          if (Object.prototype.toString.call(globalObject) === "[object Window]") {
            var htmlForDataURLNewWindow = "<html>" + "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" + "<body>" + '<iframe src="' + this.output("datauristring", options) + '"></iframe>' + "</body></html>";
            var dataURLNewWindow = globalObject.open();
            if (dataURLNewWindow !== null) {
              dataURLNewWindow.document.write(htmlForDataURLNewWindow);
              dataURLNewWindow.document.title = options.filename;
            }
            if (dataURLNewWindow || typeof safari === "undefined") return dataURLNewWindow;
          } else {
            throw new Error("The option dataurlnewwindow just works in a browser-environment.");
          }
          break;
        case "datauri":
        case "dataurl":
          return globalObject.document.location.href = this.output("datauristring", options);
        default:
          return null;
      }
    });
