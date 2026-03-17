function __method_wrapper__() {
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(
    action, value, nextAction) {
  try {
    /** @const */ var result = action.call(
        /** @type {!Iterator<VALUE>} */ (this.context_.yieldAllIterator_),
        value);
    $jscomp.generator.ensureIteratorResultIsObject_(result);
    if (!result.done) {
      this.context_.stop_();
      return result;
    }
    // After `x = yield *someGenerator()` x is the return value of the
    // generator, not a value passed to this generator by the next() method.
    /** @const */ var resultValue = result.value;
  } catch (e) {
    this.context_.yieldAllIterator_ = null;
    this.context_.throw_(e);
    return this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  nextAction.call(this.context_, resultValue);
  return this.nextStep_();
};

}
