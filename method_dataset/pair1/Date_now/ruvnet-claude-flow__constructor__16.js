class __C__ {
  constructor(options = {}) {
    this.sessionId = `pair_${Date.now()}`;
    this.mode = options.mode || 'switch';
    this.agent = options.agent || 'auto';
    this.verify = options.verify || false;
    this.test = options.test || false;
    this.autoVerify = options.autoVerify || false; // New: control automatic verification
    this.threshold = options.threshold || 0.95;
    this.startTime = new Date();
    this.status = 'active';
    this.currentRole = 'driver';
    this.verificationScores = [];
    this.testResults = [];
    this.fileWatchers = new Map();
    this.rl = null;
    this.lastVerificationTime = 0;
    this.verificationCooldown = 60000; // 1 minute cooldown between auto-verifications
    this.isVerifying = false; // Prevent concurrent verifications
  }

}
