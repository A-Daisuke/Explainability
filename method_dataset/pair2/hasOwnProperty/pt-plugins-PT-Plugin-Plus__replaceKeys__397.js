function __method_wrapper__() {
  public replaceKeys(
    source: string,
    maps: Dictionary<any>,
    prefix: string = ""
  ): string {
    if (!source || typeof source !== 'string') {
      return source;
    }
    let result: string = source;

    for (const key in maps) {
      if (maps.hasOwnProperty(key)) {
        const value = maps[key];
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
