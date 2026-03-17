class __C__ {
  async detectAnomalies() {
    const now = Date.now();
    const recentMessages = this.messageHistory.filter(m => now - m.timestamp < 5000); // Last 5 seconds
    const highVolumeThreshold = 50;

    const messageCounts = new Map<string, number>();
    recentMessages.forEach(m => {
      messageCounts.set(m.from, (messageCounts.get(m.from) || 0) + 1);
    });

    const suspiciousAgents = Array.from(messageCounts.entries())
      .filter(([agent, count]) => count > highVolumeThreshold)
      .map(([agent]) => agent);

    return {
      highVolumeDetected: suspiciousAgents.length > 0,
      suspiciousAgents,
      totalRecentMessages: recentMessages.length
    };
  }

}
