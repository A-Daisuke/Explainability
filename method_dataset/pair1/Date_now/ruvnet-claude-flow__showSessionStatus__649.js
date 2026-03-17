async function showSessionStatus() {
  try {
    const sessionPath = '.claude-flow/sessions/pair';
    const files = await fs.readdir(sessionPath);
    const sessions = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = await fs.readFile(path.join(sessionPath, file), 'utf8');
        sessions.push(JSON.parse(data));
      }
    }

    if (sessions.length === 0) {
      console.log('\n❌ No active pair programming sessions\n');
      return;
    }

    console.log('\n📊 Pair Programming Sessions:');
    console.log('━'.repeat(50));
    
    for (const session of sessions.filter(s => s.status === 'active')) {
      const duration = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000 / 60);
      console.log(`\n🔹 Session: ${session.id}`);
      console.log(`   Mode: ${session.mode}`);
      console.log(`   Duration: ${duration} minutes`);
      console.log(`   Status: ${session.status}`);
      console.log(`   Verification: ${session.verify ? '✅' : '❌'}`);
      console.log(`   Auto-Verify: ${session.autoVerify ? '✅' : '❌'}`);
      console.log(`   Testing: ${session.test ? '✅' : '❌'}`);
      
      if (session.verificationScores && session.verificationScores.length > 0) {
        const scores = session.verificationScores.map(s => s.score || s);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        console.log(`   Avg Verification: ${avg.toFixed(2)}`);
        console.log(`   Total Checks: ${scores.length}`);
      }
    }
    
    console.log('━'.repeat(50));
  } catch (error) {
    console.log('\n❌ No active pair programming sessions\n');
  }
}
