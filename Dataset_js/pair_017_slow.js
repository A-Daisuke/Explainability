const Benchmark = {
    run: function() {
    var VAR_1 = [],
      VAR_2 = [];
    function FUNCTION_1(VAR_3) {
      var VAR_4, VAR_5;
      for (VAR_4 = 0; VAR_4 < VAR_3.length; VAR_4++) {
        VAR_5 = VAR_3.splice(VAR_4, 1)[0];
        VAR_2.push(VAR_5);
        if (VAR_3.length == 0) {
          VAR_1.push(VAR_2.slice());
        }
        FUNCTION_1(VAR_3);
        VAR_3.splice(VAR_4, 0, VAR_5);
        VAR_2.pop();
      }
      return VAR_1;
    }
    FUNCTION_1(["a", "a", "b"]);
    }
};
