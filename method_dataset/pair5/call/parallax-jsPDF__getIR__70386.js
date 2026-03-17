const __obj__ = {
            getIR: function getIR(_ref2) {
              var xref = _ref2.xref,
                isEvalSupported = _ref2.isEvalSupported,
                fn = _ref2.fn;
              var dict = fn.dict;

              if (!dict) {
                dict = fn;
              }

              var types = [
                this.constructSampled,
                null,
                this.constructInterpolated,
                this.constructStiched,
                this.constructPostScript
              ];
              var typeNum = dict.get("FunctionType");
              var typeFn = types[typeNum];

              if (!typeFn) {
                throw new _util.FormatError("Unknown type of function");
              }

              return typeFn.call(this, {
                xref: xref,
                isEvalSupported: isEvalSupported,
                fn: fn,
                dict: dict
              });
            },

};
