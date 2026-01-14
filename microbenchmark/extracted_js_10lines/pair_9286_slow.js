const Benchmark = {
    run: function() {
        const VAR_1 = ["app_store_button.jpg", "advertiser.jpg"];
        const VAR_2 = [
          "/Users/x/edm/images/advertiser.jpg",
          "/Users/x/edm/images/advertiser_mob.jpg",
          "/Users/x/edm/images/app_store_button.jpg",
          "/Users/x/edm/images/header.jpg",
        ];
        VAR_2.filter(function (VAR_3) {
          return VAR_1.indexOf(VAR_3.match(/\/([^/]+)$/)[1]) !== -1;
        });
    }
};