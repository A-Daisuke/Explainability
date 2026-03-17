function __method_wrapper__() {
	getChildren(node) {
		const children = [];

		if (node == null)
			node = this.menu;

		for (const k in node.children) {
			if (!node.children.hasOwnProperty(k))
				continue;

			if (!node.children[k].satisfied)
				continue;

			if (!node.children[k].hasOwnProperty('title'))
				continue;

			let subnode = Object.assign(node.children[k], { name: k });

			if (L.isObject(subnode.action) && subnode.action.path != null &&
				(subnode.action.type == 'alias' || subnode.action.type == 'rewrite')) {
				let root = this.menu;
				const path = subnode.action.path.split('/');

				for (let i = 0; root != null && i < path.length; i++)
					root = L.isObject(root.children) ? root.children[path[i]] : null;

				if (root)
					subnode = Object.assign({}, subnode, {
						children: root.children,
						action: root.action
					});
			}

			children.push(subnode);
		}

		return children.sort((a, b) => {
			const wA = a.order ?? 1000;
			const wB = b.order ?? 1000;

			if (wA != wB)
				return wA - wB;

			return L.naturalCompare(a.name, b.name);
		});
	}

}
