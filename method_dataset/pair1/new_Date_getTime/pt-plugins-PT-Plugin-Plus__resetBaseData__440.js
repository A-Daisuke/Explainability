function __method_wrapper__() {
    resetBaseData(result: any) {
      var fillOpacity = 0.3;
      var datas = [
        {
          type: "spline",
          name: this.$t("statistic.upload").toString(),
          tooltip: {
            formatter: function(): any {
              let _this = this as any;
              return filters.formatSize(_this.x);
            }
          },
          fillOpacity: fillOpacity,
          data: [] as any
        },
        {
          type: "spline",
          name: this.$t("statistic.download").toString(),
          tooltip: {
            valueSuffix: " "
          },
          fillOpacity: fillOpacity,
          data: [] as any
        },
        {
          type: "spline",
          name: this.$t("statistic.bonus").toString(),
          yAxis: 1,
          tooltip: {
            valueSuffix: " "
          },
          fillOpacity: fillOpacity,
          data: [] as any
        }
      ];
      var types = {};
      var colors = ["#1b5e20", "#b71c1c", "#2f7ed8", "#03A9F4"];
      var categories = [];
      let latest = {
        downloaded: 0,
        uploaded: 0,
        bonus: 0,
        name: ""
      };

      let _self = this;

      // 数据
      for (const date in result) {
        if (result.hasOwnProperty(date)) {
          const data = result[date];

          if (!data.uploaded && !data.downloaded) {
            continue;
          }
          if (date == EUserDataRange.latest) {
            latest = data;
            continue;
          }

          const time = new Date(date).getTime();

          datas[0].data.push([time, this.getNumber(data.uploaded)]);
          datas[1].data.push([time, this.getNumber(data.downloaded)]);
          datas[2].data.push([time, this.getNumber(data.bonus)]);
          categories.push(date);
        }
      }

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
          text: this.$t("statistic.baseDataSubTitle", {
            uploaded: filters.formatSize(latest.uploaded),
            downloaded: filters.formatSize(latest.downloaded),
            bonus: filters.formatNumber(latest.bonus)
          }).toString()
        },
        title: {
          text: this.$t("statistic.baseDataTitle", {
            userName: latest.name || this.userName,
            site: this.selectedSite.name
          }).toString()
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%Y-%m-%d",
            week: "%Y-%m-%d",
            month: "%Y-%m-%d",
            year: "%Y-%m-%d"
          },
          // categories: categories,
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
                color: colors[3]
              }
            },
            title: {
              text: this.$t("statistic.data").toString(),
              style: {
                color: colors[3]
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
                color: colors[2]
              }
            },
            title: {
              text: this.$t("statistic.bonus").toString(),
              style: {
                color: colors[2]
              }
            },
            lineWidth: 1,
            gridLineDashStyle: "ShortDash"
          }
        ],
        tooltip: {
          shared: true,
          crosshairs: {
            width: 1,
            color: "red",
            dashStyle: "shortdot"
          },
          useHTML: true,
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
                case _self.$t("statistic.upload").toString():
                case _self.$t("statistic.download").toString():
                  value = filters.formatSize(point.y);
                  break;

                case _self.$t("statistic.bonus").toString():
                  value = filters.formatNumber(point.y);
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

      this.chartBaseData = chart;
    },

}
