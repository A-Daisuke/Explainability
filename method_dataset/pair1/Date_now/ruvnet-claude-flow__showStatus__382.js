class __C__ {
  async showStatus() {
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    
    console.log('\n📊 Session Status');
    console.log('━'.repeat(40));
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Duration: ${duration} minutes`);
    console.log(`Current Role: ${this.currentRole.toUpperCase()}`);
    console.log(`Mode: ${this.mode}`);
    console.log(`Status: ${this.status}`);
    console.log(`Auto-Verify: ${this.autoVerify ? 'Enabled' : 'Disabled'}`);
    
    if (this.verify && this.verificationScores.length > 0) {
      const recent = this.verificationScores[this.verificationScores.length - 1];
      console.log(`Last Verification: ${recent.score.toFixed(2)} (${new Date(recent.timestamp).toLocaleTimeString()})`);
    }
    
    if (this.test && this.testResults.length > 0) {
      const passed = this.testResults.filter(r => r.passed).length;
      console.log(`Tests Passed: ${passed}/${this.testResults.length}`);
    }
  }

}
