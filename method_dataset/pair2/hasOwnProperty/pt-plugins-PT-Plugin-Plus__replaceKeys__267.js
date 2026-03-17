function __method_wrapper__() {
  replaceKeys(
    source: string,
    keys: Dictionary<any>,
    prefix: string = ""
  ): string {
    let result: string = source;

    for (const key in keys) {
      if (keys.hasOwnProperty(key)) {
        const value = keys[key];
        let search = "$" + key + "$";
        if (prefix) {
          search = `$${prefix}.${key}$`;
        }
        result = result.replace(search, value);
      }
    }
    return result;
  }

}
