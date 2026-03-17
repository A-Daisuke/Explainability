function __method_wrapper__() {
          return function(it) {
            var O = toIObject(it);
            var keys = getKeys(O);
            var length = keys.length;
            var i = 0;
            var result = [];
            var key;

            while (length > i) {
              if (isEnum.call(O, (key = keys[i++]))) {
                result.push(isEntries ? [key, O[key]] : O[key]);
              }
            }

            return result;
          };

}
