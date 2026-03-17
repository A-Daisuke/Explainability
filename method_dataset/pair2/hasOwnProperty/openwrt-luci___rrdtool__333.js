function __method_wrapper__() {
	_rrdtool: function(def, rrd, timespan, width, height, cache) {
		var cmdline = [
			'graph', '-', '-a', 'PNG',
			'-s', 'NOW-%s'.format(timespan || this.opts.timespan),
			'-e', 'NOW-15',
			'-w', width || this.opts.width,
			'-h', height || this.opts.height
		];

		for (var i = 0; i < def.length; i++) {
			var opt = String(def[i]);

			if (rrd)
				opt = opt.replace(/\{file\}/g, rrd);

			cmdline.push(opt);
		}

		if (L.isObject(cache)) {
			var key = sfh(cmdline.join('\0'));

			if (!cache.hasOwnProperty(key))
				cache[key] = fs.exec_direct('/usr/bin/rrdtool', cmdline, 'blob', true);

			return cache[key];
		}

		return fs.exec_direct('/usr/bin/rrdtool', cmdline, 'blob', true);
	},

}
