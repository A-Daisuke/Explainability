        var $propertyIsEnumerable = function propertyIsEnumerable(key) {
          var E = isEnum.call(this, (key = toPrimitive(key, true)));
          if (
            this === ObjectProto &&
            has(AllSymbols, key) &&
            !has(OPSymbols, key)
          )
            return false;
          return E ||
            !has(this, key) ||
            !has(AllSymbols, key) ||
            (has(this, HIDDEN) && this[HIDDEN][key])
            ? E
            : true;
        };
