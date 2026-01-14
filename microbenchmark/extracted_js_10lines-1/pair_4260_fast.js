const Benchmark = {
    run: function() {
        var VAR_1 =
          "thiosdhfoijsdfoijas;ogjs;odjgd;foigj;odjgdf;ogjzdohfkszdkfvsdzfhsdgkdfkjdfghdsflkjdsfglkjhdflgkjhdfglkjhdfsg;ljkhd;ljkhdg;lkjfd;lkhdf;lkjhd;lkjdg;lkjd;lkjd;lkjd;lkjldjffjgjjfdjdjdjd";
        var VAR_2 = VAR_1.split("");
        var VAR_7 = VAR_2.reverse();
        var VAR_3 = VAR_1.toString();
        var VAR_4;
        var VAR_5 = "";
        var FUNCTION_1 = function (VAR_6) {
          VAR_5 += VAR_6;
        };
        while ((VAR_4 = VAR_7.pop())) {
          VAR_5 += VAR_4;
        }
    }
};