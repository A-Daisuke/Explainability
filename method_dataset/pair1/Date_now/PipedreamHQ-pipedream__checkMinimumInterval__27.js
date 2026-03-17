function __method_wrapper__() {
    checkMinimumInterval(files) {
      const interval = this.perFileInterval;
      if (!interval) return files;

      const now = Date.now();
      const minTimestamp = now - (interval * 1000 * 60);

      const savedData = this._getFileIntervals();
      Object.entries(savedData).forEach(([
        key,
        value,
      ]) => {
        if (value < minTimestamp) delete savedData[key];
      });

      const filteredFiles = files.filter(({ id }) => {
        const exists = !!savedData[id];
        if (!exists) {
          savedData[id] = now;
        }
        return !exists;
      });
      this._setFileIntervals(savedData);
      return filteredFiles;
    },

}
