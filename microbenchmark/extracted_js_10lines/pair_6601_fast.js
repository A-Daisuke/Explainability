const Benchmark = {
    run: function() {
        function FUNCTION_1() {}
        function FUNCTION_2() {}
        var VAR_1 = [
          new FUNCTION_1(),
          new FUNCTION_2(),
          new FUNCTION_1(),
          { KEY_1: 1 },
          { KEY_2: 1 },
          { KEY_3: 1 },
          Object.create(null),
        ];
        var VAR_2 = Object.prototype;
        var VAR_3 = Object;
        for (var VAR_4 = 0, VAR_5 = VAR_1.length; VAR_4 < VAR_5; VAR_4++) {
          var VAR_6 = Object.getPrototypeOf(VAR_1[VAR_4]) === VAR_2;
        }
    }
};