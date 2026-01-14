const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1.replace(/(\ |\-)/g, "").match(/.{1,3}/g);
          var VAR_3 = VAR_2[VAR_2.length - 1];
          var VAR_4;
          var VAR_5;
          if (VAR_3.length === 1) {
            VAR_4 = VAR_2[VAR_2.length - 2];
            VAR_5 = VAR_4.substr(-1);
            VAR_4 = VAR_4.substr(0, VAR_4.length - 1);
            VAR_3 = VAR_5 + VAR_3;
            VAR_2[VAR_2.length - 1] = VAR_3;
            VAR_2[VAR_2.length - 2] = VAR_4;
          }
          return VAR_2.join("-");
        }
        FUNCTION_1("00-44 48 5555 8361");
    }
};