function __method_wrapper__() {
            handleEvent: (eventName, arg) => {
                if (propertyIsDynamicEvent(eventName)) {
                    const event = host[eventName].call(host, arg);
                    if (typeof event !== 'function') {
                        throw new Error(`Missing dynamic event ${eventName} on main thread host.`);
                    }
                    return event;
                }
                if (propertyIsEvent(eventName)) {
                    const event = host[eventName];
                    if (typeof event !== 'function') {
                        throw new Error(`Missing event ${eventName} on main thread host.`);
                    }
                    return event;
                }
                throw new Error(`Malformed event name ${eventName}`);
            }

}
