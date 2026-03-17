function parseList(s, dest)
{
	var re = /([^\n]*)\n/g,
	    pkg = null, key = null, val = null, m;

	while ((m = re.exec(s)) !== null) {
		if (m[1].match(/^\s(.*)$/)) {
			if (pkg !== null && key !== null && val !== null)
				val += '\n' + RegExp.$1.trim();

			continue;
		}

		if (key !== null && val !== null) {
			switch (key) {
			case 'package':
				pkg = { name: val };
				break;

			case 'depends':
			case 'provides':
				var list = val.split(/\s*,\s*/);
				if (list.length !== 1 || list[0].length > 0)
					pkg[key] = list;
				break;

			case 'installed-time':
				pkg.installtime = new Date(+val * 1000);
				break;

			case 'installed-size':
				pkg.installsize = +val;
				break;

			case 'status':
				var stat = val.split(/\s+/),
				    mode = stat[1],
				    installed = stat[2];

				switch (mode) {
				case 'user':
				case 'hold':
					pkg[mode] = true;
					break;
				}

				switch (installed) {
				case 'installed':
					pkg.installed = true;
					break;
				}
				break;

			case 'essential':
				if (val === 'yes')
					pkg.essential = true;
				break;

			case 'size':
				pkg.size = +val;
				break;

			case 'architecture':
			case 'auto-installed':
			case 'filename':
			case 'sha256sum':
			case 'section':
				break;

			default:
				pkg[key] = val;
				break;
			}

			key = val = null;
		}

		if (m[1].trim().match(/^([\w-]+)\s*:(.+)$/)) {
			key = RegExp.$1.toLowerCase();
			val = RegExp.$2.trim();
		}
		else if (pkg) {
			dest.pkgs[pkg.name] = pkg;

			var provides = dest.providers[pkg.name] ? [] : [ pkg.name ];

			if (pkg.provides)
				provides.push.apply(provides, pkg.provides);

			provides.forEach(function(p) {
				dest.providers[p] = dest.providers[p] || [];
				dest.providers[p].push(pkg);
			});
		}
	}
}
