function __method_wrapper__() {
			super(key, ...callArgs) {
				if (key == null)
					return null;

				const slotIdx = `${this.__id__}.${key}`;
				const symStack = superContext[slotIdx];
				let protoCtx = null;

				for (protoCtx = Object.getPrototypeOf(symStack ? symStack[0] : Object.getPrototypeOf(this));
					 protoCtx != null && !protoCtx.hasOwnProperty(key);
					 protoCtx = Object.getPrototypeOf(protoCtx)) {}

				if (protoCtx == null)
					return null;

				let res = protoCtx[key];

				if (callArgs.length > 0) {
					if (typeof(res) != 'function')
						throw new ReferenceError(`${key} is not a function in base class`);

					if (Array.isArray(callArgs[0]) || LuCI.prototype.isArguments(callArgs[0]))
						callArgs = callArgs[0];

					if (symStack)
						symStack.unshift(protoCtx);
					else
						superContext[slotIdx] = [ protoCtx ];

					res = res.apply(this, callArgs);

					if (symStack && symStack.length > 1)
						symStack.shift(protoCtx);
					else
						delete superContext[slotIdx];
				}

				return res;
			},

}
