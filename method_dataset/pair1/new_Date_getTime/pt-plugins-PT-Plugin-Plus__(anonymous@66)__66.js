function __method_wrapper__() {
    Vue.filter("timeAgo", (source: any, weekOnly: boolean = false) => {
      if (!source) {
        return "";
      }
      let unit = {
        year: this.i18n.vuei18n.t("timeline.time.year", this.i18n.currentLanguage).toString(),
        month: this.i18n.vuei18n.t("timeline.time.month", this.i18n.currentLanguage).toString(),
        day: this.i18n.vuei18n.t("timeline.time.day", this.i18n.currentLanguage).toString(),
        hour: this.i18n.vuei18n.t("timeline.time.hour", this.i18n.currentLanguage).toString(),
        mins: this.i18n.vuei18n.t("timeline.time.mins", this.i18n.currentLanguage).toString(),
        week: this.i18n.vuei18n.t("timeline.time.week", this.i18n.currentLanguage).toString()
      };

      let now = new Date().getTime();

      let mins = Math.floor(Math.abs(now - source) / 1000 / 60);
      let hours = Math.floor(mins / 60);
      mins -= hours * 60;
      let days = Math.floor(hours / 24);
      hours -= days * 24;

      if (weekOnly) {
        let week = Math.floor(days / 7);
        if (week < 1) {
          return this.i18n.vuei18n.t("timeline.time.lessThanAWeek", this.i18n.currentLanguage).toString();
        }
        return `${week}${unit.week}`;
      }

      let months = Math.floor(days / 30);
      let days2 = days - months * 30;
      let years = Math.floor(days / 365);
      months -= years * 12;
      while (months > 12) {
        years++;
        months -= 12;
      }
      let result = "";

      switch (true) {
        case years > 0:
          result = years + unit["year"] + months + unit["month"];
          break;

        case months > 0:
          result = months + unit["month"] + days2 + unit["day"];
          break;

        case days > 0:
          result = days + unit["day"] + hours + unit["hour"];
          break;

        case hours > 0:
          result = hours + unit["hour"] + mins + unit["mins"];
          break;

        case mins > 0:
          result = mins + unit["mins"];
          break;

        default:
          result = "< 1" + unit["mins"];
      }

      return result + this.i18n.vuei18n.t("timeline.time.ago", this.i18n.currentLanguage).toString();
    });

}
