class __C__ {
    getTotalData(source: any) {
      let result: Dictionary<any> = {};
      let nameInfo = { name: "", maxCount: 0 };
      let userNames: Dictionary<any> = {};
      let days: any[] = [];

      for (const host in source) {
        if (source.hasOwnProperty(host)) {
          const siteData = this.fillData(source[host]);
          let site: Site = this.options.sites.find((item: Site) => {
            return item.host == host;
          });

          if (!site) {
            continue;
          }

          if (!site.allowGetUserInfo) {
            continue;
          }

          for (const date in siteData) {
            if (siteData.hasOwnProperty(date)) {
              const data = siteData[date];

              if (
                !data.uploaded &&
                !data.downloaded &&
                !data.seedingSize &&
                !data.seeding
              ) {
                continue;
              }

              let item = result[date];
              if (!item) {
                item = {
                  uploaded: 0,
                  downloaded: 0,
                  seedingSize: 0,
                  seeding: 0,
                  bonus: 0,
                  name: "",
                  lastUpdateStatus: EDataResultType.success,
                };
              }

              item.uploaded += this.getNumber(data.uploaded);
              item.downloaded += this.getNumber(data.downloaded);

              if (data.seeding && data.seeding > 0) {
                item.seeding += Math.round(data.seeding);
              }

              item.seedingSize += this.getNumber(data.seedingSize);
              item.bonus += this.getNumber(data.bonus);

              if (!userNames[data.name]) {
                userNames[data.name] = 0;
              }
              userNames[data.name]++;

              // 获取使用最多的用户名
              if (userNames[data.name] > nameInfo.maxCount) {
                nameInfo.name = data.name;
                nameInfo.maxCount = userNames[data.name];
              }

              result[date] = item;

              if (!days.includes(date)) {
                days.push(date);
              }
            }
          }
        }
      }

      let datas: Dictionary<any> = {};
      days.sort().forEach(day => {
        datas[day] = result[day];
      });

      this.userName = nameInfo.name;

      return datas;
    },

}
