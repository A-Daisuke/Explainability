const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
      if (VAR_1 === "a") {
        throw "Error";
      }
    }
    function FUNCTION_2(VAR_4, VAR_5, VAR_6) {
      FUNCTION_1(VAR_4, VAR_5, VAR_6);
    }
    function FUNCTION_3(VAR_7, VAR_8, VAR_9) {
      FUNCTION_2(VAR_7, VAR_8, VAR_9);
    }
    var VAR_10 = [];
    (function () {
      var VAR_11 = 100;
      while (VAR_11) {
        VAR_10.push(VAR_11);
        --VAR_11;
      }
    })();
    var VAR_12;
    for (VAR_11 = 0; VAR_11 < VAR_10.length; ++VAR_11) {
      FUNCTION_3(VAR_10[VAR_11], VAR_11, VAR_10);
    }
    }
};
