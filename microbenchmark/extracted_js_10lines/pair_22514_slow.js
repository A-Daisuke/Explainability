const Benchmark = {
    run: function() {
        const VAR_1 = 100000000;
        function FUNCTION_1(VAR_2 = 0) {
          let VAR_3 = [];
          let VAR_4;
          for (let VAR_5; VAR_5 <= VAR_1; VAR_5++) {
            switch (VAR_2) {
              case 0:
                VAR_4 = VAR_5;
                break;
              case 1:
                VAR_4 = { KEY_1: VAR_5 };
                break;
              case 2:
                VAR_4 = VAR_5 % 2 ? VAR_5 : { KEY_2: VAR_5 };
                break;
            }
            VAR_3.push(VAR_4);
          }
          return VAR_3;
        }
        let VAR_6 = [];
        let VAR_7 = [];
        VAR_6 = FUNCTION_1(0);
    }
};