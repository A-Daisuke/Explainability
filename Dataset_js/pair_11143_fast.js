const Benchmark = {
    run: function() {
        var VAR_1 =
          /^(https?:)?\/\/([^.?#\/]+\.)*?yandex\.(ru|by|ua|kz|com|com\.tr|net|st)(:\d{1,5})?([#\/?].*)?$/;
        var VAR_2 = new RegExp(
          "^(https?:)?//([^.?#/]+.)*?yandex.(ru|by|ua|kz|com|com.tr|net|st)(:d{1,5})?([#/?].*)?$",
        );
        var VAR_3;
        var VAR_4;
        /^(https?:)?\/\/([^.?#\/]+\.)*?yandex\.(ru|by|ua|kz|com|com\.tr|net|st)(:\d{1,5})?([#\/?].*)?$/.test(
          "//yandex.ru",
        );
    }
};