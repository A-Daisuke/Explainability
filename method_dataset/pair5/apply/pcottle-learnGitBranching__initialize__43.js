function __method_wrapper__() {
  initialize: function(options) {
    options = options || {};
    options.level = {};
    this.options = options;

    var locale = LocaleStore.getLocale();
    if (!options.skipIntro) {
      options.level.startDialog = {};
      options.level.startDialog[locale] = {
        childViews: intl.getDialog(require('../dialogs/levelBuilder')),
      };
    }

    // if we are editing a level our behavior is a bit different
    var editLevelJSON;
    if (options.editLevel) {
      editLevelJSON = LevelStore.getLevel(options.editLevel);
      options.level = editLevelJSON;
    }

    LevelBuilder.__super__.initialize.apply(this, [options]);
    if (!options.editLevel) {
      this.startDialogObj = undefined;
      this.definedGoal = false;
    } else {
      this.startDialogObj = editLevelJSON.startDialog[locale];
      this.definedGoal = true;
    }

    // we won't be using this stuff, and it is deleted to ensure we overwrite all functions that
    // include that functionality
    delete this.treeCompare;
    delete this.solved;
  },

}
