function __method_wrapper__() {
		EventEmitter.prototype.emit = function (name) {
			if (!this.$events) {
				return false;
			}

			var handler = this.$events[name];

			if (!handler) {
				return false;
			}

			var args = [].slice.call(arguments, 1);

			if ('function' == typeof handler) {
				handler.apply(this, args);
			} else if (isArray(handler)) {
				var listeners = handler.slice();

				for (var i = 0, l = listeners.length; i < l; i++) {
					listeners[i].apply(this, args);
				}
			} else {
				return false;
			}

			return true;
		};

}
