function __method_wrapper__() {
  private getCache() {
    let result = window.localStorage.getItem(this.cacheKey);
    if (result) {
      let json = JSON.parse(result);
      if (json.data && json.time) {
        let time = new Date().getTime();

        if (json.time < time) {
          window.localStorage.removeItem(this.cacheKey);
          return null;
        }

        return json.data;
      }
    }
    return null;
  }

}
