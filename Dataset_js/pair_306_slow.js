const Benchmark = {
    run: function() {
        var VAR_1 = new Float32Array(9);
        var VAR_2 = new Float32Array(4);
        for (var VAR_3 = 0; VAR_3 < 100000; VAR_3++) {
          VAR_2.set([VAR_1[0], VAR_1[1], VAR_1[2], VAR_1[3]]);
          VAR_2[0] += VAR_3;
          VAR_2[1] += VAR_3;
          VAR_2[2] += VAR_3;
          VAR_2[3] += VAR_3;
          VAR_1.set(VAR_2, 0);
        }
    }
};