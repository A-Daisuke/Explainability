function __method_wrapper__() {
            DOMTokenList.prototype.remove = function() {
              for (
                var _len2 = arguments.length,
                  tokens = new Array(_len2),
                  _key2 = 0;
                _key2 < _len2;
                _key2++
              ) {
                tokens[_key2] = arguments[_key2];
              }

              for (var _i2 = 0; _i2 < tokens.length; _i2++) {
                var token = tokens[_i2];
                OriginalDOMTokenListRemove.call(this, token);
              }
            };

}
