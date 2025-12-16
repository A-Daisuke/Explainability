const Benchmark = {
    run: function() {
    var VAR_1 = 200,
      VAR_2 = VAR_1;
    var VAR_3 = [];
    while (VAR_2--) {
      VAR_3.push(0);
    }
    FUNCTION_1(100);
    function FUNCTION_1(VAR_4) {
      return Array.apply(null, new Array(VAR_4)).map(Number.prototype.valueOf, 0);
    }
    }
};
