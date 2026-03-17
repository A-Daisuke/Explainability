class __C__ {
  async end() {
    console.log('\n🛑 Ending pair programming session...');
    
    // Clear timers
    if (this.roleTimer) clearTimeout(this.roleTimer);
    if (this.rl) this.rl.close();
    
    // Update session
    this.status = 'completed';
    await this.saveSession();
    
    // Show summary
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    console.log('\n✨ Session Complete!');
    console.log('━'.repeat(40));
    console.log(`Duration: ${duration} minutes`);
    
    if (this.verificationScores.length > 0) {
      const avg = this.verificationScores.reduce((sum, item) => sum + item.score, 0) / this.verificationScores.length;
      console.log(`Average Verification: ${avg.toFixed(2)}`);
      console.log(`Total Checks: ${this.verificationScores.length}`);
    }
    
    if (this.testResults.length > 0) {
      const passed = this.testResults.filter(r => r.passed).length;
      console.log(`Test Success Rate: ${((passed / this.testResults.length) * 100).toFixed(0)}%`);
      console.log(`Total Test Runs: ${this.testResults.length}`);
    }
    
    console.log('\n👋 Thanks for pair programming!\n');
  }

}
