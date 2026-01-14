const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3, 8];
        var VAR_2 = [3, 2, 8, 5];
        var VAR_3 = ["Jane", "Kenny", "Thomas", "Kelvin"];
        var VAR_4 = ["Arron", "Jane", "Kelvin", "Nick"];
        function FUNCTION_1(VAR_5, VAR_6) {
          var VAR_7 = new Set();
          VAR_1.map((VAR_8) => VAR_7.add(VAR_8));
          VAR_2.map((VAR_9) => VAR_7.add(VAR_9));
          var VAR_10 = VAR_1.length + VAR_2.length - VAR_7.size;
        }
        FUNCTION_1(VAR_1, VAR_2);
        FUNCTION_1(VAR_3, VAR_4);
    }
};