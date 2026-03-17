function __method_wrapper__() {
  has(key: K): boolean {
    const item = this.items.get(key);

    if (!item) {
      return false;
    }

    if (Date.now() > item.expiry) {
      this.items.delete(key);
      this.stats.expirations++;

      if (this.onExpire) {
        this.onExpire(key, item.value);
      }

      return false;
    }

    return true;
  }

}
