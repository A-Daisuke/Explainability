function __method_wrapper__() {
  initialize: function(options) {
    options = options || {};
    options.level = options.level || {};

    this.level = options.level;

    this.gitCommandsIssued = [];
    this.solved = false;
    this.wasResetAfterSolved = false;

    this.initGoalData(options);
    this.initName(options);
    this.on('minimizeCanvas', this.minimizeGoal);
    this.on('resizeCanvas', this.resizeGoal);
    this.isGoalExpanded = false;

    Level.__super__.initialize.apply(this, [options]);
    this.startOffCommand();

    this.handleOpen(options.deferred);
    LevelActions.setIsSolvingLevel(true);
  },

}
