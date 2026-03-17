const __obj__ = {
                value: function createFontFaceRule() {
                  if (!this.data || this.disableFontFace) {
                    return null;
                  }

                  var data = (0, _util.bytesToString)(
                    new Uint8Array(this.data)
                  );
                  var url = "url(data:"
                    .concat(this.mimetype, ";base64,")
                    .concat(btoa(data), ");");
                  var rule = '@font-face {font-family:"'
                    .concat(this.loadedName, '";src:')
                    .concat(url, "}");

                  if (this.fontRegistry) {
                    this.fontRegistry.registerFont(this, url);
                  }

                  return rule;
                }

};
