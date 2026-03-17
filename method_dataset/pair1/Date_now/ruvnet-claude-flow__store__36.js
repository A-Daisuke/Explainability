function __method_wrapper__() {
  async store(key: string, value: string, namespace: string = 'default') {
    await this.load();

    if (!this.data[namespace]) {
      this.data[namespace] = [];
    }

    // Remove existing entry with same key
    this.data[namespace] = this.data[namespace].filter((e) => e.key !== key);

    // Add new entry
    this.data[namespace].push({
      key,
      value,
      namespace,
      timestamp: Date.now(),
    });

    await this.save();
  }

}
