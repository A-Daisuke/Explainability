class __C__ {
    resetExtData(result: any) {
      var fillOpacity = 0.3;
      var datas = [
        {
          type: "spline",
          name: this.$t("statistic.seedingSize").toString(),
          fillOpacity: fillOpacity,
          data: [] as any
        },
        {
          type: "spline",
          name: this.$t("statistic.seedingCount").toString(), //"做种数",
          yAxis: 1,
          fillOpacity: fillOpacity,
          data: [] as any
        }
      ];
      var types = {};
      var colors = ["#FF6F00", "#2E7D32", "#2f7ed8", "#03A9F4"];
      var categories = [];
      let latest = {
        seeding: 0,
        seedingSize: 0,
        name: ""
      };

      // 数据
      for (const date in result) {
        if (result.hasOwnProperty(date)) {
          const data = result[date];

          if (!data.seedingSize && !data.seeding) {
            continue;
          }
          if (date == EUserDataRange.latest) {
            latest = data;
            continue;
          }

          const time = new Date(date).getTime();

          datas[0].data.push([time, parseFloat(data.seedingSize)]);
          datas[1].data.push([time, parseFloat(data.seeding)]);
          categories.push(date);
        }
      }

      let _self = this;
      var chart = {
        chart: {
          backgroundColor: null
        },
        series: datas,
        colors: colors,
        // 版权信息
        credits: {
          enabled: false
        },
        subtitle: {
          text: this.$t("statistic.seedingDataSubTitle", {
            seedingSize: filters.formatSize(latest.seedingSize),
            count: latest.seeding
          }).toString()
        },
        title: {
          text: this.$t("statistic.seedingDataTitle", {
            userName: latest.name || this.userName,
            site: this.selectedSite.name
          }).toString()
        },
        xAxis: {
          // categories: categories,
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%Y-%m-%d",
            week: "%Y-%m-%d",
            month: "%Y-%m-%d",
            year: "%Y-%m-%d"
          },
          gridLineDashStyle: "ShortDash",
          gridLineWidth: 1,
          gridLineColor: "#dddddd"
        },
        yAxis: [
          {
            labels: {
              formatter: function(): any {
                let _this = this as any;
                return filters.formatSize(_this.value);
              },
              style: {
                color: colors[0]
              }
            },
            title: {
              text: this.$t("statistic.size").toString(), //"体积",
              style: {
                color: colors[0]
              }
            },
            lineWidth: 1,
            gridLineDashStyle: "ShortDash"
          },
          {
            opposite: true,
            labels: {
              formatter: function(): any {
                let _this = this as any;
                return formatBonus(_this.value);
              },
              style: {
                color: colors[1]
              }
            },
            title: {
              text: this.$t("statistic.count").toString(), //"数量",
              style: {
                color: colors[1]
              }
            },
            lineWidth: 1,
            gridLineDashStyle: "ShortDash"
          }
        ],
        tooltip: {
          shared: true,
          useHTML: true,
          crosshairs: {
            width: 1,
            color: "red",
            dashStyle: "shortdot"
          },
          formatter: function(): any {
            function createTipItem(text: string, color: string = "#000") {
              return `<div style='color:${color};'>${text}</div>`;
            }
            let _this = this as any;
            let tips: string[] = [];
            // 标题（时间）
            tips.push(createTipItem(dayjs(_this.x).format("YYYY-MM-DD")));
            _this.points.forEach((point: any) => {
              let value = point.y;
              switch (point.series.name) {
                // "做种体积"
                case _self.$t("statistic.seedingSize").toString():
                  value = filters.formatSize(point.y);
                  break;
              }

              tips.push(
                createTipItem(`${point.series.name}: ${value}`, point.color)
              );
            });

            let result = `<div>${tips.join("")}</div>`;
            return result;
          }
        }
      };

      this.chartExtData = chart;
    },

}
