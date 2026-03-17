function __method_wrapper__() {
  data() {
    return {
      shareMessage: this.$t("timeline.shareMessage").toString(),
      displayUserName: "",
      sites: [] as Site[],
      showSites: [] as string[],
      infos: {
        nameInfo: { name: "test", maxCount: 0 },
        joinTimeInfo: {
          site: {} as Site,
          time: new Date().getTime(),
          years: 0 as number | string
        },
        maxUploadedInfo: {
          site: {} as Site,
          maxValue: 0
        },
        maxSeedingInfo: {
          site: {} as Site,
          maxValue: 0
        },
        total: {
          uploaded: 0,
          downloaded: 0,
          seedingSize: 0,
          ratio: -1,
          seeding: 0
        }
      },
      options: this.$store.state.options as Options,
      version: "",
      datas: [] as Site[],
      shareTime: new Date(),
      shareing: false,
      showUserName: true,
      showSiteName: false,
      showUserLevel: true,
      showUid: true,
      blurSiteIcon: true,
      iconCache: {} as Dictionary<any>
    };
  },

}
