function __method_wrapper__() {
  getResult(content: any, rule: any): Dictionary<any> {
    let results: Dictionary<any> = {};

    if (content) {
      for (const key in rule.fields) {
        if (rule.fields.hasOwnProperty(key)) {
          let config = rule.fields[key];

          let result = this.getFieldData(content, config, rule);
          if (result != null) {
            results[key] = result;
          }
        }
      }
    }

    return results;
  }

}
