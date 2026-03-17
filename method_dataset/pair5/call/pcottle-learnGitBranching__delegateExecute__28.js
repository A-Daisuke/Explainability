const __obj__ = {
  delegateExecute: function(config, engine, commandObj) {
    // we have delegated to another vcs command, so lets
    // execute that and get the result
    var result = config.delegate.call(this, engine, commandObj);

    if (result.multiDelegate) {
      // we need to do multiple delegations with
      // a different command at each step
      result.multiDelegate.forEach(function(delConfig) {
        // copy command, and then set opts
        commandObj.setOptionsMap(delConfig.options || {});
        commandObj.setGeneralArgs(delConfig.args || []);

        commandConfigs[delConfig.vcs][delConfig.name].execute.call(this, engine, commandObj);
      }, this);
    } else {
      config = commandConfigs[result.vcs][result.name];
      // commandObj is PASSED BY REFERENCE
      // and modified in the function
      commandConfigs[result.vcs][result.name].execute.call(this, engine, commandObj);
    }
  },

};
