const Benchmark = {
    run: function() {
        let VAR_1 = 5000;
        let VAR_2 = "Processing";
        let VAR_3 = 0;
        let VAR_4 = 0;
        let VAR_5 = 0;
        for (let VAR_6 = 0; VAR_6 < VAR_1; ++VAR_6) {
          switch (VAR_2.charAt(2)) {
            case "t":
              ++VAR_3;
              break;
            case "i":
            case "n":
            case "m":
              ++VAR_4;
              break;
            default: {
              ++VAR_5;
              break;
            }
          }
        }
    }
};