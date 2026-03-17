function __method_wrapper__() {
    _backgroundTokenizeWithDeadline(deadline) {
        // Read the time remaining from the `deadline` immediately because it is unclear
        // if the `deadline` object will be valid after execution leaves this function.
        const endTime = Date.now() + deadline.timeRemaining();
        const execute = () => {
            if (this._isDisposed || !this._tokenizerWithStateStore._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
                // disposed in the meantime or detached or finished
                return;
            }
            this._backgroundTokenizeForAtLeast1ms();
            if (Date.now() < endTime) {
                // There is still time before reaching the deadline, so yield to the browser and then
                // continue execution
                setTimeout0(execute);
            }
            else {
                // The deadline has been reached, so schedule a new idle callback if necessary
                this._beginBackgroundTokenization();
            }
        };
        execute();
    }

}
