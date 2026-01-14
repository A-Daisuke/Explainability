const Benchmark = {
    run: function() {
        let VAR_1 = [];
        let VAR_2;
        let VAR_3;
        for (VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
          VAR_3 = Math.random();
          if (VAR_3 >= 0.9) {
            VAR_1.push(0);
          } else {
            VAR_1.push(Math.floor((VAR_3 / 0.9) * 100));
          }
        }
        let VAR_6 = Int32Array.from(VAR_1.filter((VAR_7) => VAR_7 != 0));
        let VAR_8 = VAR_1.length - VAR_6.length;
        VAR_6.sort();
        VAR_6.reverse();
        let VAR_9 = new Int32Array(VAR_1.length);
        VAR_9.set(VAR_6, VAR_8);
        let VAR_10 = Array.from(VAR_9);
    }
};