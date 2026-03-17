class __C__ {
  logAccess(key, agent, operation) {
    this.accessLog.set(key, {
      key,
      agent,
      operation,
      timestamp: Date.now()
    });
    
    // Limit access log size
    if (this.accessLog.size > 10000) {
      const entries = Array.from(this.accessLog.entries())
        .sort(([,a], [,b]) => b.timestamp - a.timestamp)
        .slice(0, 5000);
      
      this.accessLog.clear();
      for (const [key, log] of entries) {
        this.accessLog.set(key, log);
      }
    }
  }

}
