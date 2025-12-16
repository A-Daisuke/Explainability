const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1) {
      return VAR_1.replace("http://", "").replace("https://", "").split("/")[0];
    }
    function FUNCTION_2(VAR_2) {
      var VAR_3 = document.createElement("a");
      VAR_3.VAR_4 = VAR_2;
      return VAR_3.hostname;
    }
    var VAR_5 =
      "http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls/9744104#9744104";
    FUNCTION_1(VAR_5);
    }
};
