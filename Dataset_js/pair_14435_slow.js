const Benchmark = {
    run: function() {
        var VAR_1 = [
          "google.com",
          "www.google.com",
          "google.co",
          "www.google.co",
          "google.com.az",
          "www.google.com.az",
          "google.co.az",
          "www.google.co.az",
        ];
        VAR_2 = /^(.*\.)?(google)(\.com?)?(\.[a-z]{2})?$/;
        VAR_3 = /(^|\.)google\.(com?|[a-z]{2}|com?\.[a-z]{2})$/;
        var VAR_4 = VAR_1.every(function (VAR_5) {
          return VAR_2.test(VAR_5);
        });
        if (!VAR_4) {
          for (var VAR_6 = 0; VAR_6 < 1000000; VAR_6++);
        }
    }
};