function __method_wrapper__() {
  async end() {
    console.log('\n🛑 Ending enhanced pair programming session...');
    
    if (this.rl) this.rl.close();
    if (this.monitoringInterval) clearInterval(this.monitoringInterval);
    
    this.status = 'completed';
    await this.saveSession();
    
    const duration = Math.floor((Date.now() - this.startTime) / 1000 / 60);
    console.log('\n✨ Session Complete!');
    console.log('━'.repeat(40));
    console.log(`Duration: ${duration} minutes`);
    console.log(`Guidance Mode: ${this.guidance.name}`);
    console.log(`Total Fixes: ${this.fixHistory.length}`);
    console.log(`Suggestions Given: ${this.suggestionHistory.length}`);
    
    if (this.verificationScores.length > 0) {
      const final = this.verificationScores[this.verificationScores.length - 1];
      console.log(`Final Score: ${final.score.toFixed(2)}`);
    }
    
    if (this.guidanceMode === 'mentor' || this.guidanceMode === 'beginner') {
      console.log('\n📚 Session Summary:');
      console.log('  • Key concepts covered');
      console.log('  • Best practices applied');
      console.log('  • Improvements achieved');
      console.log('\n💡 Keep learning and improving!');
    }
    
    console.log('\n👋 Thanks for using enhanced pair programming!\n');
  }

}
