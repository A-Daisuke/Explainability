const Benchmark = {
    run: function() {
        var VAR_1 = 1024 * 32;
        var VAR_2 = 3 * 1024;
        var VAR_3 = new ArrayBuffer(VAR_1);
        var VAR_4 = new Uint32Array(VAR_3, 0, VAR_2);
        var VAR_5 = 0;
        while (VAR_5 < VAR_2) {
          VAR_4[VAR_5++] = Math.random() * (1 << 16);
          VAR_4[VAR_5++] = Math.random() * (1 << 32);
          VAR_4[VAR_5++] = Math.random() * (1 << 32);
        }
        var VAR_6 = "";
        var VAR_7,
          VAR_8 = VAR_4.length;
        for (VAR_5 = 0; VAR_5 < VAR_8; ++VAR_5) {
          VAR_6 += "," + VAR_4[VAR_5].toString(16);
        }
    }
};