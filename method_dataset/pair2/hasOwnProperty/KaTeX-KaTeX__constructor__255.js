function __method_wrapper__() {
    constructor(options: SettingsOptions) {
        // allow null options
        options = options || {};
        for (const prop in SETTINGS_SCHEMA) {
            if (SETTINGS_SCHEMA.hasOwnProperty(prop)) {
                // $FlowFixMe
                const schema = SETTINGS_SCHEMA[prop];
                // TODO: validate options
                // $FlowFixMe
                this[prop] = options[prop] !== undefined ? (schema.processor
                        ? schema.processor(options[prop]) : options[prop])
                    : getDefaultValue(schema);
            }
        }
    }

}
