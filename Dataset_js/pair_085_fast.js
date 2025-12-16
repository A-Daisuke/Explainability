const Benchmark = {
    run: function() {
    FUNCTION_1 = function (VAR_1, VAR_2) {
      do {
        if (VAR_1.hasOwnProperty(VAR_2)) {
          return VAR_1[VAR_2];
        }
        VAR_1 = VAR_1.__proto__;
      } while (VAR_1);
    };
    var FUNCTION_2 = function (VAR_3) {
      this.VAR_4 = VAR_3;
    };
    var VAR_5 = new FUNCTION_2("Smith");
    for (var VAR_6 = 0; VAR_6 < 1000; VAR_6++) {
      FUNCTION_1(VAR_5, "name");
      FUNCTION_1(VAR_5, "toString");
    }
    }
};
