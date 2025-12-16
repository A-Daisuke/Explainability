const Benchmark = {
    run: function() {
    var VAR_1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    function FUNCTION_1(VAR_2) {
      for (var VAR_3 = 0; VAR_3 < VAR_1.length; VAR_3++) {
        if (VAR_1[VAR_3] === VAR_2) {
          return true;
        }
      }
      return false;
    }
    var VAR_4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function FUNCTION_2(VAR_5) {
      return VAR_4.indexOf(VAR_5) !== -1;
    }
    function FUNCTION_3(VAR_6) {
      return new RegExp(VAR_6).test(VAR_4);
    }
    FUNCTION_1("Z");
    }
};
