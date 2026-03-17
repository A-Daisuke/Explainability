class __C__ {
		attr(node, key, val) {
			if (!this.elem(node))
				return null;

			let attr = null;

			if (typeof(key) === 'object' && key !== null)
				attr = key;
			else if (typeof(key) === 'string')
				attr = {}, attr[key] = val;

			for (key in attr) {
				if (!attr.hasOwnProperty(key) || attr[key] == null)
					continue;

				switch (typeof(attr[key])) {
				case 'function':
					node.addEventListener(key, attr[key]);
					break;

				case 'object':
					node.setAttribute(key, JSON.stringify(attr[key]));
					break;

				default:
					node.setAttribute(key, attr[key]);
				}
			}
		},

}
