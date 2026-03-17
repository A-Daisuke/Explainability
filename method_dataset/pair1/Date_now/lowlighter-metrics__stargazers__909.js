function __method_wrapper__() {
            get stargazers() {
              const dates = []
              let total = faker.number.int(1000)
              const result = {
                worldmap: this.__stargazers.worldmap,
                total: {
                  dates: {},
                  get max() {
                    return Math.max(...dates.map(date => this.dates[date]))
                  },
                  get min() {
                    return Math.min(...dates.map(date => this.dates[date]))
                  },
                },
                increments: {
                  dates: {},
                  get max() {
                    return Math.max(...dates.map(date => this.dates[date]))
                  },
                  get min() {
                    return Math.min(...dates.map(date => this.dates[date]))
                  },
                },
                months: ["", "Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."],
              }
              for (let d = -14; d <= 0; d++) {
                const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
                dates.push(date)
                result.total.dates[date] = total += result.increments.dates[date] = faker.number.int(100)
              }
              return result
            },

}
