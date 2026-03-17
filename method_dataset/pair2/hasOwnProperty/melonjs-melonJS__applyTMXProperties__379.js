export function applyTMXProperties(obj, data) {
	const properties = data.properties;
	const types = data.propertytypes;
	if (typeof properties !== "undefined") {
		for (const property in properties) {
			if (properties.hasOwnProperty(property)) {
				let type = "string";
				let name = property;
				let value = properties[property];
				// proof-check for new and old JSON format
				if (typeof properties[property].name !== "undefined") {
					name = properties[property].name;
				}
				if (typeof types !== "undefined") {
					type = types[property];
				} else if (typeof properties[property].type !== "undefined") {
					type = properties[property].type;
				}
				if (typeof properties[property].value !== "undefined") {
					value = properties[property].value;
				}
				// set the value
				obj[name] = setTMXValue(name, type, value);
			}
		}
	}
}
