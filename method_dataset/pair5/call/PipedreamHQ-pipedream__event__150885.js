function __method_wrapper__() {
            IOSession.prototype.event = function (body, eventName) {
                ts.Debug.assert(!!this.constructed, "Should only call `IOSession.prototype.event` on an initialized IOSession");
                if (this.canUseEvents && this.eventPort) {
                    if (!this.eventSocket) {
                        if (this.logger.hasLevel(server.LogLevel.verbose)) {
                            this.logger.info("eventPort: event \"" + eventName + "\" queued, but socket not yet initialized");
                        }
                        (this.socketEventQueue || (this.socketEventQueue = [])).push({ body: body, eventName: eventName });
                        return;
                    }
                    else {
                        ts.Debug.assert(this.socketEventQueue === undefined);
                        this.writeToEventSocket(body, eventName);
                    }
                }
                else {
                    _super.prototype.event.call(this, body, eventName);
                }
            };

}
