export function register(plugin, name = plugin.toString().match(/ (\w+)/)[1]) {
	// ensure me.plugins[name] is not already "used"
	if (cache[name]) {
		throw new Error("plugin " + name + " already registered");
	}

	// get extra arguments
	let _args = [];
	if (arguments.length > 2) {
		// store extra arguments if any
		_args = Array.prototype.slice.call(arguments, 1);
	}

	// try to instantiate the plugin
	_args[0] = plugin;
	const instance = new (plugin.bind.apply(plugin, _args))();

	// inheritance check
	if (typeof instance === "undefined" || !(instance instanceof BasePlugin)) {
		throw new Error("Plugin should extend the BasePlugin Class !");
	}

	// compatibility testing
	if (checkVersion(instance.version, version) > 0) {
		throw new Error(
			"Plugin version mismatch, expected: " +
				instance.version +
				", got: " +
				version,
		);
	}

	// create a reference to the new plugin
	cache[name] = instance;
}
