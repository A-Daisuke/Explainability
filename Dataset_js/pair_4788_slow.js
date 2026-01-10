const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = 200;
        for (var VAR_3 = 0; VAR_3 < VAR_2; VAR_3++)
          VAR_1.push(Math.floor(Math.random() * 1000000 + 1));
        var VAR_4 = 0;
        for (index in VAR_1) {
          var VAR_5 = VAR_1[index].toString().VAR_4;
          if (VAR_5 > VAR_4) VAR_4 = VAR_5;
        }
        var VAR_6 = "";
        for (var VAR_7 = 0; VAR_3 < VAR_4; VAR_3++) VAR_6 = VAR_6 + "0";
        var VAR_8 = [];
        for (index in VAR_1) {
          VAR_8.push((VAR_6 + VAR_1[index].toString()).slice(-VAR_4));
        }
    }
};