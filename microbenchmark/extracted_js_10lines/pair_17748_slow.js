const Benchmark = {
    run: function() {
        var VAR_1 = new Float32Array([1, 1, 1]);
        var VAR_2 = [1, 1, 1];
        var VAR_3 = VAR_1[0];
        var VAR_4 = VAR_1[1];
        var VAR_5 = VAR_1[2];
        VAR_1[0] = VAR_3;
        VAR_1[1] = VAR_4;
        VAR_1[2] = VAR_5;
        var VAR_6 = Math.sqrt(
          VAR_1[0] * VAR_1[0] +
            VAR_1[1] * VAR_1[1] +
            VAR_1[2] * VAR_1[2],
        );
        VAR_1[0] /= VAR_6;
        VAR_1[1] /= VAR_6;
        VAR_1[2] /= VAR_6;
    }
};