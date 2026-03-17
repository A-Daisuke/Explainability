function __method_wrapper__() {
  async end() {
    console.log('\n🛑 Ending pair programming session...');
    
    if (this.rl) this.rl.close();
    
    this.status = 'completed';
    await this.saveSession();
    
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    console.log('\n✨ Session Complete!');
    console.log('━'.repeat(40));
    console.log(`Duration: ${duration} minutes`);
    console.log(`Total Fixes: ${this.fixHistory.length}`);
    console.log(`Final Iterations: ${this.currentIteration}`);
    
    if (this.verificationScores.length > 0) {
      const final = this.verificationScores[this.verificationScores.length - 1];
      console.log(`Final Score: ${final.score.toFixed(2)}`);
    }
    
    console.log('\n👋 Thanks for pair programming!\n');
  }

}
