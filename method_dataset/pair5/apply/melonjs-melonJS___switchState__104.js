function _switchState(state) {
	// clear previous interval if any
	_stopRunLoop();

	// call the stage destroy method
	if (_stages[_state]) {
		// just notify the object
		_stages[_state].stage.destroy();
	}

	if (_stages[state]) {
		// set the global variable
		_state = state;

		// call the reset function with _extraArgs as arguments
		_stages[_state].stage.reset.apply(_stages[_state].stage, _extraArgs);

		// and start the main loop of the
		// new requested state
		_startRunLoop();

		// publish the pause event
		eventEmitter.emit(STATE_CHANGE);

		// execute callback if defined
		if (_onSwitchComplete) {
			_onSwitchComplete();
		}
	}
}
