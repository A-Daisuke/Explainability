const Benchmark = {
    run: function() {
        const VAR_1 = "Greetings from Earth";
        const VAR_2 = "htraE morf sgniteerG";
        function FUNCTION_1(VAR_3) {
          return VAR_3.split("").reverse().join("");
        }
        function FUNCTION_2(VAR_6) {
          if (VAR_6 === "") return "";
          else return FUNCTION_2(VAR_3.substr(1)) + VAR_3.charAt(0);
        }
        FUNCTION_1(VAR_1) === VAR_2;
    }
};