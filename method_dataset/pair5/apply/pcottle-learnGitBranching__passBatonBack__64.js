function __method_wrapper__() {
EventBaton.prototype.passBatonBack = function(name, func, context, args) {
  // this method will call the listener BEFORE the name/func pair. this
  // basically allows you to put in shims, where you steal batons but pass
  // them back if they don't meet certain conditions
  var listeners = this.getListenersThrow(name);

  var indexBefore;
  listeners.forEach(function(listenerObj, index) {
    // skip the first
    if (index === 0) { return; }
    if (listenerObj.func === func && listenerObj.context === context) {
      indexBefore = index - 1;
    }
  });
  if (indexBefore === undefined) {
    throw new Error('you are the last baton holder! or i didn\'t find you');
  }
  var toCallObj = listeners[indexBefore];

  toCallObj.func.apply(toCallObj.context, args);
};

}
