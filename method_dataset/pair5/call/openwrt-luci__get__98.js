		var get = function(args, key) {
			var names = key.trim().split(/\./),
			    obj = args,
			    ctx = obj;

			for (var i = 0; i < names.length; i++) {
				if (!L.isObject(obj))
					return null;

				ctx = obj;
				obj = obj[names[i]];
			}

			if (typeof(obj) == 'function')
				return obj.call(ctx);

			return obj;
		};
