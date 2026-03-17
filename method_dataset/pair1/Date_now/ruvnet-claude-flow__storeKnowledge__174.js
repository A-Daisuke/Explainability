function __method_wrapper__() {
  async storeKnowledge(domain, key, value, metadata = {}) {
    return this.store(
      `knowledge:${domain}:${key}`,
      {
        domain,
        key,
        value,
        metadata,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        namespace: 'knowledge',
        metadata: { domain },
      },
    );
  }

}
