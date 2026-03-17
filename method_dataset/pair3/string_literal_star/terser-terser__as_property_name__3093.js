    function as_property_name() {
        var tmp = S.token;
        switch (tmp.type) {
          case "punc":
            if (tmp.value === "[") {
                next();
                var ex = expression(false);
                expect("]");
                return ex;
            } else unexpected(tmp);
          case "operator":
            if (tmp.value === "*") {
                next();
                return null;
            }
            if (!["delete", "in", "instanceof", "new", "typeof", "void"].includes(tmp.value)) {
                unexpected(tmp);
            }
            /* falls through */
          case "name":
          case "privatename":
          case "string":
          case "keyword":
          case "atom":
            next();
            return tmp.value;
          case "num":
          case "big_int":
            next();
            return "" + tmp.value;
          default:
            unexpected(tmp);
        }
    }
