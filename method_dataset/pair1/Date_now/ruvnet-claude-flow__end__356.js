class __C__ {
  async end() {
    console.log('\n🛑 Ending pair programming session...');
    
    // Clear intervals
    if (this.verificationInterval) clearInterval(this.verificationInterval);
    if (this.testInterval) clearInterval(this.testInterval);
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
      const avgScore = this.verificationScores.reduce((a, b) => a + b, 0) / this.verificationScores.length;
      console.log(`Average Verification: ${avgScore.toFixed(2)}`);
    }
    
    if (this.testResults.length > 0) {
      const passed = this.testResults.filter(r => r.passed).length;
      console.log(`Test Success Rate: ${((passed / this.testResults.length) * 100).toFixed(0)}%`);
    }
    
    console.log('\n👋 Thanks for pair programming!\n');
  }

}
