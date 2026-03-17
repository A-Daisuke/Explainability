function __method_wrapper__() {
    memories.forEach((memory) => {
      // Count by category
      const category = memory.category || memory.type || 'general';
      stats.categories[category] = (stats.categories[category] || 0) + 1;

      // Track dates
      const date = new Date(memory.timestamp || Date.now());
      if (!stats.oldestDate || date < stats.oldestDate) {
        stats.oldestDate = date;
      }
      if (!stats.newestDate || date > stats.newestDate) {
        stats.newestDate = date;
      }

      // Estimate size
      stats.totalSize += JSON.stringify(memory).length;
    });

}
