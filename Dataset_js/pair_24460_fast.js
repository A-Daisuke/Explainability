const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return ["1", "22", "333", "4444"].includes(VAR_1);
        }
        function FUNCTION_2(VAR_2) {
          return VAR_2 === "1" || VAR_2 === "22" || VAR_2 === "333" || VAR_2 === "4444";
        }
        function FUNCTION_3(VAR_3) {
          return !(VAR_3 !== "1" && VAR_3 !== "22" && VAR_3 !== "333" && VAR_3 !== "4444");
        }
        FUNCTION_3("333");
    }
};