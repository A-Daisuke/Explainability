function __method_wrapper__() {
    getTime(timeStr) {
      let timeRegex = timeStr.match(
        /((\d+).+?(minute|hour|day|week|month|year)s?.*?(\,|and))?.*?(\d+).+?(minute|hour|day|week|month|year)s?/
      );
      let milliseconds = 0;
      if (timeRegex) {
        if (timeRegex[1] == undefined) {
          milliseconds = this.getMilliseconds(timeRegex[5], timeRegex[6]);
        } else {
          milliseconds = this.getMilliseconds(timeRegex[2], timeRegex[3]) + this.getMilliseconds(timeRegex[5], timeRegex[6]);
        }
      }
      console.log(timeRegex);
      let timeStamp = Date.now() - milliseconds;
      let date = new Date(timeStamp);
      return date.toISOString();
    }

}
