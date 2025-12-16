const Benchmark = {
    run: function() {
    function FUNCTION_1(VAR_1) {
      var VAR_2 = "KB";
      VAR_1 /= 1024;
      if (VAR_1 > 1024) {
        VAR_1 /= 1024;
        VAR_2 = "MB";
      }
      if (VAR_1 > 1024) {
        VAR_1 /= 1024;
        VAR_2 = "GB";
      }
      VAR_1 = VAR_1.toFixed(2) + " " + VAR_2;
      return VAR_1;
    }
    FUNCTION_1(2738472847);
    }
};
