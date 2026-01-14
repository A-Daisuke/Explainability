const Benchmark = {
    run: function() {
        var VAR_1 = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ];
        var VAR_2 = 2;
        const VAR_3 = [];
        let VAR_7 = [...VAR_1];
        const VAR_8 = Math.ceil(VAR_7.length / VAR_2);
        for (let VAR_4 = 0; VAR_4 < VAR_8; VAR_4++) {
          VAR_3.push(VAR_7.splice(0, VAR_2));
        }
    }
};