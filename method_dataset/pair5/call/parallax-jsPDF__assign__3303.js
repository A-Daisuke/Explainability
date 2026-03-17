function __method_wrapper__() {
            ? function assign(target, source) {
                var T = toObject(target);
                var aLen = arguments.length;
                var index = 1;
                var getSymbols = gOPS.f;
                var isEnum = pIE.f;

                while (aLen > index) {
                  var S = IObject(arguments[index++]);
                  var keys = getSymbols
                    ? getKeys(S).concat(getSymbols(S))
                    : getKeys(S);
                  var length = keys.length;
                  var j = 0;
                  var key;

                  while (length > j) {
                    if (isEnum.call(S, (key = keys[j++]))) T[key] = S[key];
                  }
                }

                return T;
              }

}
