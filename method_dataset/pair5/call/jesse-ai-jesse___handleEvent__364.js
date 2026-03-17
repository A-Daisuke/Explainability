class __C__ {
    _handleEvent(eventName, arg) {
        if (!this._requestHandler) {
            throw new Error(`Missing requestHandler`);
        }
        if (propertyIsDynamicEvent(eventName)) {
            const event = this._requestHandler[eventName].call(this._requestHandler, arg);
            if (typeof event !== 'function') {
                throw new Error(`Missing dynamic event ${eventName} on request handler.`);
            }
            return event;
        }
        if (propertyIsEvent(eventName)) {
            const event = this._requestHandler[eventName];
            if (typeof event !== 'function') {
                throw new Error(`Missing event ${eventName} on request handler.`);
            }
            return event;
        }
        throw new Error(`Malformed event name ${eventName}`);
    }

}
