function __method_wrapper__() {
  private async generateReport(): Promise<void> {
    const totalDuration = Date.now() - this.startTime;
    const successCount = this.results.filter(r => r.success).length;
    
    const report = {
      summary: {
        totalAgents: this.results.length,
        successfulAgents: successCount,
        failedAgents: this.results.length - successCount,
        totalDuration: totalDuration,
        averageDuration: totalDuration / this.results.length
      },
      results: this.results,
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(__dirname, "results.json"),
      JSON.stringify(report, null, 2)
    );

    console.log("\n📊 Execution Summary:");
    console.log(`Total agents: ${report.summary.totalAgents}`);
    console.log(`Successful: ${report.summary.successfulAgents}`);
    console.log(`Failed: ${report.summary.failedAgents}`);
    console.log(`Total duration: ${report.summary.totalDuration}ms`);
    console.log(`Average duration: ${Math.round(report.summary.averageDuration)}ms`);
    console.log("\nDetailed results saved to results.json");
  }

}
