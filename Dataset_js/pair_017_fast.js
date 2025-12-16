const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_3) {
      return VAR_3.length <= 2
        ? [VAR_3.slice(), VAR_3.slice().reverse()]
        : [].concat.apply(
            [],
            VAR_3.map(function (VAR_6, VAR_7, VAR_8) {
              var VAR_9 = VAR_3.slice();
              var VAR_10 = VAR_9.splice(VAR_7, 1);
              return FUNCTION_1(VAR_9).map(function (VAR_11) {
                return VAR_6.concat(VAR_10);
              });
            }),
          );
    }
    FUNCTION_1(["a", "a", "b"]);
    }
};
