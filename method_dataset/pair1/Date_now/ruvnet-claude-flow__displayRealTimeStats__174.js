class __C__ {
  displayRealTimeStats() {
    if (!this.enabled) return;

    const currentTime = Date.now();
    const elapsed = this.metrics.startTime ? (currentTime - this.metrics.startTime) / 1000 : 0;

    let currentMemory = '—';
    if (typeof Deno !== 'undefined' && Deno.memoryUsage) {
      const memUsage = Deno.memoryUsage();
      currentMemory = `${(memUsage.rss / 1024 / 1024).toFixed(1)}MB`;
    }

    console.log(
      `⏱️  ${elapsed.toFixed(1)}s | 💾 ${currentMemory} | 🔄 ${this.metrics.operationCount} ops`,
    );
  }

}
