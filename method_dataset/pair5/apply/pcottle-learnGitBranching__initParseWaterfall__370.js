function __method_wrapper__() {
  initParseWaterfall: function(options) {
    Level.__super__.initParseWaterfall.apply(this, [options]);

    // add our specific functionality
    this.parseWaterfall.addFirst(
      'parseWaterfall',
      parse
    );

    this.parseWaterfall.addFirst(
      'instantWaterfall',
      this.getInstantCommands()
    );

    // if we want to disable certain commands...
    if (options.level.disabledMap) {
      // disable these other commands
      this.parseWaterfall.addFirst(
        'instantWaterfall',
        new DisabledMap({
          disabledMap: options.level.disabledMap
        }).getInstantCommands()
      );
    }
  },

}
