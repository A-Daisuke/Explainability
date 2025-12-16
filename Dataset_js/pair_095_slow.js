const Benchmark = {
    run: function() {
    function FUNCTION_1() {
      return +(123.321).toFixed(2);
    }
    function FUNCTION_2() {
      return +(123.321).toLocaleString("pt-BR", {
        KEY_1: 2,
        KEY_2: 2,
      });
    }
    FUNCTION_1();
    }
};
