function __method_wrapper__() {
	change(state, forceChange = false) {
		// Protect against undefined Stage
		if (typeof _stages[state] === "undefined") {
			throw new Error("Undefined Stage for state '" + state + "'");
		}

		// do nothing if already the current state
		if (!this.isCurrent(state)) {
			_extraArgs = null;
			if (arguments.length > 1) {
				// store extra arguments if any
				_extraArgs = Array.prototype.slice.call(arguments, 1);
			}
			// if fading effect
			if (_fade.duration && _stages[state].transition) {
				_onSwitchComplete = () => {
					game.viewport.fadeOut(_fade.color, _fade.duration);
				};
				game.viewport.fadeIn(_fade.color, _fade.duration, function () {
					defer(_switchState, this, state);
				});
			}
			// else just switch without any effects
			else {
				// wait for the last frame to be
				// "finished" before switching
				if (forceChange === true) {
					_switchState(state);
				} else {
					defer(_switchState, this, state);
				}
			}
		}
	},

}
