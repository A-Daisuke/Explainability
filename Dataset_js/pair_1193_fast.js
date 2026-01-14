const Benchmark = {
    run: function() {
        var VAR_1 = 1024 * 32;
        var VAR_2 = 3 * 1024;
        var VAR_3 = new ArrayBuffer(VAR_1);
        var VAR_4 = new Uint32Array(VAR_3, 0, VAR_2);
        var VAR_6 = 0;
        while (VAR_6 < VAR_2) {
          VAR_4[VAR_6++] = Math.random() * (1 << 16);
          VAR_4[VAR_6++] = Math.random() * (1 << 32);
          VAR_4[VAR_6++] = Math.random() * (1 << 32);
        }
        var VAR_7 = "";
        var VAR_8,
          VAR_9 = VAR_4.length;
        for (VAR_6 = 0; VAR_6 < VAR_9; ++VAR_6) {
          VAR_7 += "," + VAR_4[VAR_6].toString(16);
        }
    }
};