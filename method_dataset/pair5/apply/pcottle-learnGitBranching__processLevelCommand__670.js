function __method_wrapper__() {
  processLevelCommand: function(command, defer) {
    var methodMap = {
      'show goal': this.showGoal,
      'hide goal': this.hideGoal,
      'show solution': this.showSolution,
      'start dialog': this.startDialog,
      'help level': this.startDialog,
      'objective': this.objectiveDialog
    };
    var method = methodMap[command.get('method')];
    if (!method) {
      throw new Error('woah we don\'t support that method yet', method);
    }

    method.apply(this, [command, defer]);
  }

}
