const Benchmark = {
    run: function() {
        const VAR_1 = "Greetings from Earth";
        const VAR_2 = "htraE morf sgniteerG";
        function FUNCTION_1(VAR_3) {
          var VAR_4 = "";
          for (var VAR_5 = VAR_3.length - 1; VAR_5 >= 0; VAR_5--) {
            VAR_4 += VAR_3[VAR_5];
          }
          return VAR_4;
        }
        function FUNCTION_2(VAR_6) {
          if (VAR_6 === "") return "";
          else return FUNCTION_2(VAR_3.substr(1)) + VAR_3.charAt(0);
        }
        FUNCTION_1(VAR_1) === VAR_2;
    }
};