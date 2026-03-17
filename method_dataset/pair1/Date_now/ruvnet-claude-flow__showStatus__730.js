function __method_wrapper__() {
  async showStatus() {
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    
    console.log('\n📊 Session Status');
    console.log('━'.repeat(40));
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Duration: ${duration} minutes`);
    console.log(`Guidance Mode: ${this.guidance.name}`);
    console.log(`Auto-Fix: ${this.autoFix ? 'Enabled' : 'Disabled'}`);
    console.log(`Iterations: ${this.currentIteration}`);
    console.log(`Fixes Applied: ${this.fixHistory.length}`);
    console.log(`Suggestions Given: ${this.suggestionHistory.length}`);
    
    if (this.verificationScores.length > 0) {
      const latest = this.verificationScores[this.verificationScores.length - 1];
      console.log(`Latest Score: ${latest.score.toFixed(2)}`);
    }
  }

}
