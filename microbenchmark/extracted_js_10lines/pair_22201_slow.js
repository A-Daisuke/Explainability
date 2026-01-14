const Benchmark = {
    run: function() {
        var VAR_1 = [
          1, 4, 5, 34, 11, 23, 567, 54, 2, 36, 79, 23, 774, 23, 12, 33, 667, 56, 34,
          213, 454, 978, 345, 467, 89, 234, 6, 47, 9089, 45, 3456, 658, 5, 5, 423, 2, 3,
          4, 4, 45, 546,
        ];
        var VAR_2 = [],
          VAR_3;
        for (var VAR_4 = VAR_1.length - 1; VAR_3 >= 0; VAR_3--) {
          VAR_2.push(VAR_1[VAR_3]);
        }
        VAR_2.reverse();
    }
};