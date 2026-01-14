const Benchmark = {
    run: function() {
        var VAR_1 = 0.12345;
        var VAR_2 = [];
        var VAR_3 = [];
        for (var VAR_4 = 0; VAR_4 < 10000; VAR_4++) {
          var VAR_5 = VAR_4 + VAR_1;
          VAR_2.push(VAR_5.toString());
          VAR_3.push('{"num":' + VAR_5.toString() + "}");
        }
        var VAR_6 = [];
        for (var VAR_7 = 0; VAR_4 < VAR_3.length; VAR_4++) {
          VAR_6.push(JSON.parse(VAR_3[VAR_4]).VAR_5);
        }
    }
};