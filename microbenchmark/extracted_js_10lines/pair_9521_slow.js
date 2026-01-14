const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
          VAR_1.KEY_1(VAR_2, VAR_3);
          return {
            KEY_1: function (VAR_4, VAR_5) {
              return FUNCTION_1(VAR_1, VAR_4, VAR_5);
            },
          };
        }
        var VAR_6 = new Map(
          JSON.parse(
            '[[1,"one"],[2,"two"],[3,"three"],[4,"four"],[5,"five"],[6,"six"],[7,"seven"],[8,"eight"],[9,"nine"],[10,"ten"]]',
          ),
        );
    }
};