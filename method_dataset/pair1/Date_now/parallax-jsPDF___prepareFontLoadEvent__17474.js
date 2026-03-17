const __obj__ = {
                  value: function _prepareFontLoadEvent(rules, fonts, request) {
                    function int32(data, offset) {
                      return (
                        (data.charCodeAt(offset) << 24) |
                        (data.charCodeAt(offset + 1) << 16) |
                        (data.charCodeAt(offset + 2) << 8) |
                        (data.charCodeAt(offset + 3) & 0xff)
                      );
                    }

                    function spliceString(s, offset, remove, insert) {
                      var chunk1 = s.substring(0, offset);
                      var chunk2 = s.substring(offset + remove);
                      return chunk1 + insert + chunk2;
                    }

                    var i, ii;
                    var canvas = document.createElement("canvas");
                    canvas.width = 1;
                    canvas.height = 1;
                    var ctx = canvas.getContext("2d");
                    var called = 0;

                    function isFontReady(name, callback) {
                      called++;

                      if (called > 30) {
                        (0, _util.warn)("Load test font never loaded.");
                        callback();
                        return;
                      }

                      ctx.font = "30px " + name;
                      ctx.fillText(".", 0, 20);
                      var imageData = ctx.getImageData(0, 0, 1, 1);

                      if (imageData.data[3] > 0) {
                        callback();
                        return;
                      }

                      setTimeout(isFontReady.bind(null, name, callback));
                    }

                    var loadTestFontId = "lt"
                      .concat(Date.now())
                      .concat(this.loadTestFontId++);
                    var data = this._loadTestFont;
                    var COMMENT_OFFSET = 976;
                    data = spliceString(
                      data,
                      COMMENT_OFFSET,
                      loadTestFontId.length,
                      loadTestFontId
                    );
                    var CFF_CHECKSUM_OFFSET = 16;
                    var XXXX_VALUE = 0x58585858;
                    var checksum = int32(data, CFF_CHECKSUM_OFFSET);

                    for (
                      i = 0, ii = loadTestFontId.length - 3;
                      i < ii;
                      i += 4
                    ) {
                      checksum =
                        (checksum - XXXX_VALUE + int32(loadTestFontId, i)) | 0;
                    }

                    if (i < loadTestFontId.length) {
                      checksum =
                        (checksum -
                          XXXX_VALUE +
                          int32(loadTestFontId + "XXX", i)) |
                        0;
                    }

                    data = spliceString(
                      data,
                      CFF_CHECKSUM_OFFSET,
                      4,
                      (0, _util.string32)(checksum)
                    );
                    var url = "url(data:font/opentype;base64,".concat(
                      btoa(data),
                      ");"
                    );
                    var rule = '@font-face {font-family:"'
                      .concat(loadTestFontId, '";src:')
                      .concat(url, "}");
                    this.insertRule(rule);
                    var names = [];

                    for (i = 0, ii = fonts.length; i < ii; i++) {
                      names.push(fonts[i].loadedName);
                    }

                    names.push(loadTestFontId);
                    var div = document.createElement("div");
                    div.setAttribute(
                      "style",
                      "visibility: hidden;" +
                        "width: 10px; height: 10px;" +
                        "position: absolute; top: 0px; left: 0px;"
                    );

                    for (i = 0, ii = names.length; i < ii; ++i) {
                      var span = document.createElement("span");
                      span.textContent = "Hi";
                      span.style.fontFamily = names[i];
                      div.appendChild(span);
                    }

                    document.body.appendChild(div);
                    isFontReady(loadTestFontId, function() {
                      document.body.removeChild(div);
                      request.complete();
                    });
                  }

};
