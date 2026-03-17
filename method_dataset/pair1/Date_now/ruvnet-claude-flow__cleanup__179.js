function __method_wrapper__() {
  async cleanup() {
    await this.initialize();

    let cleaned = 0;
    const now = Date.now();

    for (const [namespace, namespaceMap] of this.data.entries()) {
      for (const [key, entry] of namespaceMap.entries()) {
        if (entry.expiresAt && entry.expiresAt <= now) {
          namespaceMap.delete(key);
          cleaned++;
        }
      }
    }

    return cleaned;
  }

}
