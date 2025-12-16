const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1, VAR_2) {
      var VAR_3 = VAR_2.VAR_3;
      if (VAR_3 === 0) {
        console.log(VAR_1);
      } else {
        for (var VAR_4 = 0; VAR_4 < VAR_3; VAR_4++) {
          FUNCTION_1(
            VAR_1 + VAR_2[VAR_4],
            VAR_2.substring(0, VAR_4) + VAR_2.substring(VAR_4 + 1, VAR_3),
          );
        }
      }
    }
    FUNCTION_1("", "12345");
    }
};
