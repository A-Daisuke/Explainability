class __C__ {
  async cleanup(daysOld: number = 30) {
    await this.load();

    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    let removedCount = 0;

    for (const namespace of Object.keys(this.data)) {
      const before = this.data[namespace].length;
      this.data[namespace] = this.data[namespace].filter((e) => e.timestamp > cutoffTime);
      removedCount += before - this.data[namespace].length;
    }

    await this.save();
    return removedCount;
  }

}
