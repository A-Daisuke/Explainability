const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_6 = "";
          VAR_1 = VAR_1.replace(/-|\s/g, "");
          for (var VAR_7 = 0, VAR_8 = VAR_1.length; VAR_7 < VAR_8; VAR_7 += 3) {
            VAR_6 += VAR_1.substr(VAR_7, 3);
            if (VAR_8 <= VAR_7 + 3) {
              continue;
            }
            if (VAR_7 + 4 === VAR_8) {
              VAR_7--;
              VAR_6 = VAR_6.slice(0, -1);
            }
            VAR_6 += "-";
          }
          return VAR_6;
        }
        FUNCTION_1("00-44 48 5555 8361");
    }
};