function __method_wrapper__() {
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.items) {
      if (now > item.expiry) {
        this.items.delete(key);
        cleaned++;
        this.stats.expirations++;

        if (this.onExpire) {
          this.onExpire(key, item.value);
        }
      }
    }

    if (cleaned > 0) {
      // Optional: Log cleanup stats
    }
  }

}
