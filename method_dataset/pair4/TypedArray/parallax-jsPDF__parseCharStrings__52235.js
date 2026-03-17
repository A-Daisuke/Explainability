function __method_wrapper__() {
            parseCharStrings: function parseCharStrings(_ref) {
              var charStrings = _ref.charStrings,
                localSubrIndex = _ref.localSubrIndex,
                globalSubrIndex = _ref.globalSubrIndex,
                fdSelect = _ref.fdSelect,
                fdArray = _ref.fdArray,
                privateDict = _ref.privateDict;
              var seacs = [];
              var widths = [];
              var count = charStrings.count;

              for (var i = 0; i < count; i++) {
                var charstring = charStrings.get(i);
                var state = {
                  callDepth: 0,
                  stackSize: 0,
                  stack: [],
                  undefStack: true,
                  hints: 0,
                  firstStackClearing: true,
                  seac: null,
                  width: null,
                  hasVStems: false
                };
                var valid = true;
                var localSubrToUse = null;
                var privateDictToUse = privateDict;

                if (fdSelect && fdArray.length) {
                  var fdIndex = fdSelect.getFDIndex(i);

                  if (fdIndex === -1) {
                    (0, _util.warn)("Glyph index is not in fd select.");
                    valid = false;
                  }

                  if (fdIndex >= fdArray.length) {
                    (0, _util.warn)("Invalid fd index for glyph index.");
                    valid = false;
                  }

                  if (valid) {
                    privateDictToUse = fdArray[fdIndex].privateDict;
                    localSubrToUse = privateDictToUse.subrsIndex;
                  }
                } else if (localSubrIndex) {
                  localSubrToUse = localSubrIndex;
                }

                if (valid) {
                  valid = this.parseCharString(
                    state,
                    charstring,
                    localSubrToUse,
                    globalSubrIndex
                  );
                }

                if (state.width !== null) {
                  var nominalWidth = privateDictToUse.getByName(
                    "nominalWidthX"
                  );
                  widths[i] = nominalWidth + state.width;
                } else {
                  var defaultWidth = privateDictToUse.getByName(
                    "defaultWidthX"
                  );
                  widths[i] = defaultWidth;
                }

                if (state.seac !== null) {
                  seacs[i] = state.seac;
                }

                if (!valid) {
                  charStrings.set(i, new Uint8Array([14]));
                }
              }

              return {
                charStrings: charStrings,
                seacs: seacs,
                widths: widths
              };
            },

}
