function __method_wrapper__() {
  processSandboxCommand: function(command, deferred) {
    // I'm tempted to do cancel case conversion, but there are
    // some exceptions to the rule
    var commandMap = {
      'reset solved': this.resetSolved,
      'undo': this.undo,
      'help general': this.helpDialog,
      'help': this.helpDialog,
      'reset': this.reset,
      'delay': this.delay,
      'clear': this.clear,
      'exit level': this.exitLevel,
      'level': this.startLevel,
      'sandbox': this.exitLevel,
      'levels': this.showLevels,
      'mobileAlert': this.mobileAlert,
      'build level': this.buildLevel,
      'export tree': this.exportTree,
      'import tree': this.importTree,
      'importTreeNow': this.importTreeNow,
      'import level': this.importLevel,
      'importLevelNow': this.importLevelNow,
      'share permalink': this.sharePermalink,
    };

    var method = commandMap[command.get('method')];
    if (!method) { throw new Error('no method for that wut'); }

    method.apply(this, [command, deferred]);
  },

}
