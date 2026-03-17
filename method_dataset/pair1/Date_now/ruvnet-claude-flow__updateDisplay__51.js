function __method_wrapper__() {
  updateDisplay() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const progress = Math.floor(((this.completed + this.failed) / this.totalProjects) * 100);

    console.clear();
    console.log('🚀 Batch Initialization Progress');
    console.log('================================');
    console.log(`Total Projects: ${this.totalProjects}`);
    console.log(`Completed: ${this.completed} ✅`);
    console.log(`Failed: ${this.failed} ❌`);
    console.log(`In Progress: ${this.inProgress.size} 🔄`);
    console.log(`Progress: ${progress}% [${this.getProgressBar(progress)}]`);
    console.log(`Elapsed Time: ${elapsed}s`);

    if (this.inProgress.size > 0) {
      console.log('\nActive Projects:');
      for (const [project, startTime] of this.inProgress) {
        const projectElapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(`  - ${project} (${projectElapsed}s)`);
      }
    }
  }

}
