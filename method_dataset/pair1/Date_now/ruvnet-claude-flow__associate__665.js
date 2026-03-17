class __C__ {
  async associate(key1, key2, strength = 1.0) {
    try {
      // Store bidirectional association
      await this.store(
        `assoc:${key1}:${key2}`,
        {
          from: key1,
          to: key2,
          strength,
          created: Date.now(),
        },
        'system',
      );

      await this.store(
        `assoc:${key2}:${key1}`,
        {
          from: key2,
          to: key1,
          strength,
          created: Date.now(),
        },
        'system',
      );

      this.emit('memory:associated', { key1, key2, strength });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

}
