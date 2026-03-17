function __method_wrapper__() {
  async showStatus() {
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    
    console.log('\n📊 Session Status');
    console.log('━'.repeat(40));
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Duration: ${duration} minutes`);
    console.log(`Current Role: ${this.currentRole.toUpperCase()}`);
    console.log(`Mode: ${this.mode}`);
    console.log(`Status: ${this.status}`);
    
    if (this.verify && this.verificationScores.length > 0) {
      const avgScore = this.verificationScores.reduce((a, b) => a + b, 0) / this.verificationScores.length;
      console.log(`Average Verification: ${avgScore.toFixed(2)}`);
    }
    
    if (this.test && this.testResults.length > 0) {
      const passed = this.testResults.filter(r => r.passed).length;
      console.log(`Tests Passed: ${passed}/${this.testResults.length}`);
    }
  }

}
