class __C__ {
	pull(name, ...args) {
		const className = this.objectClass[name];
		if (className) {
			const proto = className["class"];
			const poolArray = className.pool;
			let obj;

			if (poolArray && (obj = poolArray.pop())) {
				// poolable object must implement a `onResetEvent` method
				obj.onResetEvent.apply(obj, args);
				this.instance_counter--;
			} else {
				// create a new instance
				obj = new (proto.bind.apply(proto, [proto, ...args]))();
				if (poolArray) {
					obj.className = name;
				}
			}
			return obj;
		}
		throw new Error("Cannot instantiate object of type '" + name + "'");
	}

}
