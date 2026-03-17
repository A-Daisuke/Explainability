function __method_wrapper__() {
            extractFontProgram: function Type1Parser_extractFontProgram() {
              var stream = this.stream;
              var subrs = [],
                charstrings = [];
              var privateData = Object.create(null);
              privateData["lenIV"] = 4;
              var program = {
                subrs: [],
                charstrings: [],
                properties: {
                  privateData: privateData
                }
              };
              var token, length, data, lenIV, encoded;

              while ((token = this.getToken()) !== null) {
                if (token !== "/") {
                  continue;
                }

                token = this.getToken();

                switch (token) {
                  case "CharStrings":
                    this.getToken();
                    this.getToken();
                    this.getToken();
                    this.getToken();

                    while (true) {
                      token = this.getToken();

                      if (token === null || token === "end") {
                        break;
                      }

                      if (token !== "/") {
                        continue;
                      }

                      var glyph = this.getToken();
                      length = this.readInt();
                      this.getToken();
                      data =
                        length > 0
                          ? stream.getBytes(length)
                          : new Uint8Array(0);
                      lenIV = program.properties.privateData["lenIV"];
                      encoded = this.readCharStrings(data, lenIV);
                      this.nextChar();
                      token = this.getToken();

                      if (token === "noaccess") {
                        this.getToken();
                      }

                      charstrings.push({
                        glyph: glyph,
                        encoded: encoded
                      });
                    }

                    break;

                  case "Subrs":
                    this.readInt();
                    this.getToken();

                    while (this.getToken() === "dup") {
                      var index = this.readInt();
                      length = this.readInt();
                      this.getToken();
                      data =
                        length > 0
                          ? stream.getBytes(length)
                          : new Uint8Array(0);
                      lenIV = program.properties.privateData["lenIV"];
                      encoded = this.readCharStrings(data, lenIV);
                      this.nextChar();
                      token = this.getToken();

                      if (token === "noaccess") {
                        this.getToken();
                      }

                      subrs[index] = encoded;
                    }

                    break;

                  case "BlueValues":
                  case "OtherBlues":
                  case "FamilyBlues":
                  case "FamilyOtherBlues":
                    var blueArray = this.readNumberArray();

                    if (
                      blueArray.length > 0 &&
                      blueArray.length % 2 === 0 &&
                      HINTING_ENABLED
                    ) {
                      program.properties.privateData[token] = blueArray;
                    }

                    break;

                  case "StemSnapH":
                  case "StemSnapV":
                    program.properties.privateData[
                      token
                    ] = this.readNumberArray();
                    break;

                  case "StdHW":
                  case "StdVW":
                    program.properties.privateData[
                      token
                    ] = this.readNumberArray()[0];
                    break;

                  case "BlueShift":
                  case "lenIV":
                  case "BlueFuzz":
                  case "BlueScale":
                  case "LanguageGroup":
                  case "ExpansionFactor":
                    program.properties.privateData[token] = this.readNumber();
                    break;

                  case "ForceBold":
                    program.properties.privateData[token] = this.readBoolean();
                    break;
                }
              }

              for (var i = 0; i < charstrings.length; i++) {
                glyph = charstrings[i].glyph;
                encoded = charstrings[i].encoded;
                var charString = new Type1CharString();
                var error = charString.convert(
                  encoded,
                  subrs,
                  this.seacAnalysisEnabled
                );
                var output = charString.output;

                if (error) {
                  output = [14];
                }

                program.charstrings.push({
                  glyphName: glyph,
                  charstring: output,
                  width: charString.width,
                  lsb: charString.lsb,
                  seac: charString.seac
                });
              }

              return program;
            },

}
