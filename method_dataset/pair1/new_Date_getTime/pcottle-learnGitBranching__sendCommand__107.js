function __method_wrapper__() {
HeadlessGit.prototype.sendCommand = function(value, entireCommandPromise) {
  var deferred = Q.defer();
  var chain = deferred.promise;
  var startTime = new Date().getTime();

  var commands = [];

  util.splitTextCommand(value, function(commandStr) {
    chain = chain.then(function() {
      var commandObj = new Command({
        rawStr: commandStr
      });

      var thisDeferred = Q.defer();
      this.gitEngine.dispatch(commandObj, thisDeferred);
      commands.push(commandObj);
      return thisDeferred.promise;
    }.bind(this));
  }, this);

  chain.then(function() {
    var nowTime = new Date().getTime();
    if (entireCommandPromise) {
      entireCommandPromise.resolve(commands);
    }
  });

  chain.fail(function(err) {
    console.log('!!!!!!!! error !!!!!!!');
    console.log(err);
    console.log(err.stack);
    console.log('!!!!!!!!!!!!!!!!!!!!!!');
  });
  deferred.resolve();
  return chain;
};

}
