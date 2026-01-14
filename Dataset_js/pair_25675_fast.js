const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = "0";
          var VAR_2 = "3";
          var VAR_3;
          switch (VAR_1) {
            case "0":
              VAR_3 = 0 * 90;
              break;
            case "1":
              VAR_3 = -(1 * 90);
              break;
            case "2":
              VAR_3 = 2 * 90;
              break;
            case "3":
              VAR_3 = -(3 * 90);
              break;
          }
          switch (VAR_2) {
            case "0":
              VAR_3 = 0 * 90;
              break;
            case "1":
              VAR_3 = -(1 * 90);
              break;
            case "2":
              VAR_3 = 2 * 90;
              break;
            case "3":
              VAR_3 = -(3 * 90);
              break;
          }
          return VAR_3;
        }
        FUNCTION_1();
    }
};