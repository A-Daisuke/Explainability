class __C__ {
		data(node, key, val) {
			if (!node?.getAttribute)
				return null;

			let id = node.getAttribute('data-idref');

			/* clear all data */
			if (arguments.length > 1 && key == null) {
				if (id != null) {
					node.removeAttribute('data-idref');
					val = this.registry[id]
					delete this.registry[id];
					return val;
				}

				return null;
			}

			/* clear a key */
			else if (arguments.length > 2 && key != null && val == null) {
				if (id != null) {
					val = this.registry[id][key];
					delete this.registry[id][key];
					return val;
				}

				return null;
			}

			/* set a key */
			else if (arguments.length > 2 && key != null && val != null) {
				if (id == null) {
					do { id = Math.floor(Math.random() * 0xffffffff).toString(16) }
					while (this.registry.hasOwnProperty(id));

					node.setAttribute('data-idref', id);
					this.registry[id] = {};
				}

				return (this.registry[id][key] = val);
			}

			/* get all data */
			else if (arguments.length == 1) {
				if (id != null)
					return this.registry[id];

				return null;
			}

			/* get a key */
			else if (arguments.length == 2) {
				if (id != null)
					return this.registry[id][key];
			}

			return null;
		},

}
