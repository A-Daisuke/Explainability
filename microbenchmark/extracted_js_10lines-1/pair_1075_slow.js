const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = [],
          VAR_3 = [],
          VAR_4 = 100,
          VAR_5 = 10000,
          VAR_6 = 100000,
          VAR_7;
        while (VAR_4--) {
          VAR_1.push(Math.random());
        }
        while (VAR_5--) {
          VAR_2.push(Math.random());
        }
        while (VAR_6--) {
          VAR_3.push(Math.random());
        }
        var VAR_8 = 0;
        console.log("test " + VAR_8++);
        VAR_7 = VAR_3.concat();
        VAR_7.splice(0, VAR_7.length);
    }
};