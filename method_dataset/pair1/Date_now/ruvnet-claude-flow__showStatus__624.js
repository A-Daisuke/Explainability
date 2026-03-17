function __method_wrapper__() {
  async showStatus() {
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    
    console.log('\n📊 Session Status');
    console.log('━'.repeat(40));
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Duration: ${duration} minutes`);
    console.log(`Guidance Mode: ${this.guidanceMode}`);
    console.log(`Auto-Fix: ${this.autoFix ? 'Enabled' : 'Disabled'}`);
    console.log(`Fix Iterations: ${this.currentIteration}`);
    console.log(`Total Fixes Applied: ${this.fixHistory.reduce((sum, h) => sum + h.fixes.length, 0)}`);
    
    if (this.verificationScores.length > 0) {
      const latest = this.verificationScores[this.verificationScores.length - 1];
      console.log(`Latest Score: ${latest.score.toFixed(2)}`);
    }
  }

}
