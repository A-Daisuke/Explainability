const __obj__ = {
                  value: function _readDocumentOutline() {
                    var obj = this.catDict.get("Outlines");

                    if (!(0, _primitives.isDict)(obj)) {
                      return null;
                    }

                    obj = obj.getRaw("First");

                    if (!(0, _primitives.isRef)(obj)) {
                      return null;
                    }

                    var root = {
                      items: []
                    };
                    var queue = [
                      {
                        obj: obj,
                        parent: root
                      }
                    ];
                    var processed = new _primitives.RefSet();
                    processed.put(obj);
                    var xref = this.xref,
                      blackColor = new Uint8ClampedArray(3);

                    while (queue.length > 0) {
                      var i = queue.shift();
                      var outlineDict = xref.fetchIfRef(i.obj);

                      if (outlineDict === null) {
                        continue;
                      }

                      if (!outlineDict.has("Title")) {
                        throw new _util.FormatError(
                          "Invalid outline item encountered."
                        );
                      }

                      var data = {
                        url: null,
                        dest: null
                      };
                      Catalog.parseDestDictionary({
                        destDict: outlineDict,
                        resultObj: data,
                        docBaseUrl: this.pdfManager.docBaseUrl
                      });
                      var title = outlineDict.get("Title");
                      var flags = outlineDict.get("F") || 0;
                      var color = outlineDict.getArray("C");
                      var rgbColor = blackColor;

                      if (
                        Array.isArray(color) &&
                        color.length === 3 &&
                        (color[0] !== 0 || color[1] !== 0 || color[2] !== 0)
                      ) {
                        rgbColor = _colorspace.ColorSpace.singletons.rgb.getRgb(
                          color,
                          0
                        );
                      }

                      var outlineItem = {
                        dest: data.dest,
                        url: data.url,
                        unsafeUrl: data.unsafeUrl,
                        newWindow: data.newWindow,
                        title: (0, _util.stringToPDFString)(title),
                        color: rgbColor,
                        count: outlineDict.get("Count"),
                        bold: !!(flags & 2),
                        italic: !!(flags & 1),
                        items: []
                      };
                      i.parent.items.push(outlineItem);
                      obj = outlineDict.getRaw("First");

                      if ((0, _primitives.isRef)(obj) && !processed.has(obj)) {
                        queue.push({
                          obj: obj,
                          parent: outlineItem
                        });
                        processed.put(obj);
                      }

                      obj = outlineDict.getRaw("Next");

                      if ((0, _primitives.isRef)(obj) && !processed.has(obj)) {
                        queue.push({
                          obj: obj,
                          parent: i.parent
                        });
                        processed.put(obj);
                      }
                    }

                    return root.items.length > 0 ? root.items : null;
                  }

};
