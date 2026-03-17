function __method_wrapper__() {
              value: function dispatch(eventName) {
                var eventListeners = this._listeners[eventName];

                if (!eventListeners || eventListeners.length === 0) {
                  if (this._dispatchToDOM) {
                    var _args5 = Array.prototype.slice.call(arguments, 1);

                    this._dispatchDOMEvent(eventName, _args5);
                  }

                  return;
                }

                var args = Array.prototype.slice.call(arguments, 1);
                eventListeners.slice(0).forEach(function(listener) {
                  listener.apply(null, args);
                });

                if (this._dispatchToDOM) {
                  this._dispatchDOMEvent(eventName, args);
                }
              }

}
