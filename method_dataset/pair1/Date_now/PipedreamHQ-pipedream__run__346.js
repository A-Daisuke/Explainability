class __C__ {
  async run() {
    const startTime = Date.now();
    this.log('Starting annotation application');

    this.verifyGitStatus();
    await this.loadCsv();

    const actionFiles = await this.findActionFiles();
    await this.processFilesInBatches(actionFiles);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    this.printFinalReport(duration);

    return this.stats;
  }

}
