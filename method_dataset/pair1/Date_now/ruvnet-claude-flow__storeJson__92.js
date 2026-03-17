function __method_wrapper__() {
  async storeJson(key, value, namespace, metadata) {
    const data = await this.loadJsonData();
    
    if (!data[namespace]) {
      data[namespace] = [];
    }
    
    // Remove existing entry with same key
    data[namespace] = data[namespace].filter((e) => e.key !== key);
    
    // Add new entry
    const entry = {
      key,
      value,
      namespace,
      timestamp: Date.now(),
      ...metadata
    };
    
    data[namespace].push(entry);
    
    await this.saveJsonData(data);
    return entry;
  }

}
