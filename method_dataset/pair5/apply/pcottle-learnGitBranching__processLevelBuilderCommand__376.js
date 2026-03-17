function __method_wrapper__() {
  processLevelBuilderCommand: function(command, deferred) {
    var methodMap = {
      'define goal': this.defineGoal,
      'define start': this.defineStart,
      'show start': this.showStart,
      'hide start': this.hideStart,
      'finish': this.finish,
      'define hint': this.defineHint,
      'define name': this.defineName,
      'edit dialog': this.editDialog,
      'help builder': LevelBuilder.__super__.startDialog
    };
    if (!methodMap[command.get('method')]) {
      throw new Error('woah we don\'t support that method yet');
    }

    methodMap[command.get('method')].apply(this, arguments);
  },

}
