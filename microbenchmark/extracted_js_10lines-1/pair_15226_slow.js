const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
          KEY_4: 4,
          KEY_5: 5,
        };
        var VAR_2 = ["a", "b", "c", "d", "e"];
        var VAR_3 = "abcde".split("");
        var VAR_4;
        VAR_4 += VAR_1[VAR_2[0]] + VAR_1[VAR_2[1]] + VAR_1[VAR_2[2]] + VAR_1[VAR_2[3]] + VAR_1[VAR_2[4]];
    }
};