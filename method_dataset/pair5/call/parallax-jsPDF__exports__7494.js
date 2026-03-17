function __method_wrapper__() {
        module.exports = function(it) {
          var result = getKeys(it);
          var getSymbols = gOPS.f;

          if (getSymbols) {
            var symbols = getSymbols(it);
            var isEnum = pIE.f;
            var i = 0;
            var key;

            while (symbols.length > i) {
              if (isEnum.call(it, (key = symbols[i++]))) result.push(key);
            }
          }

          return result;
        };

}
