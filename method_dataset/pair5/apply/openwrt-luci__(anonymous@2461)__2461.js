function __method_wrapper__() {
				return Promise.all(depends).then(instances => {
					let _factory, _class;

					try {
						_factory = eval(
							'(function(window, document, L%s) { %s })\n\n//# sourceURL=%s\n'
								.format(args, source, res.url));
					}
					catch (error) {
						LuCI.prototype.raise('SyntaxError', '%s\n  in %s:%s',
							error.message, res.url, error.lineNumber ?? '?');
					}

					_factory.displayName = toCamelCase(`${name}ClassFactory`);
					_class = _factory.apply(_factory, [window, document, L].concat(instances));

					if (!Class.isSubclass(_class))
						LuCI.prototype.error('TypeError', '"%s" factory yields invalid constructor', name);

					if (_class.displayName == 'AnonymousClass')
						_class.displayName = toCamelCase(`${name}Class`);

					let ptr = Object.getPrototypeOf(L);
					let idx = 0;
					const parts = name.split(/\./);
					const instance = new _class();

					while (ptr && idx < parts.length - 1)
						ptr = ptr[parts[idx++]];

					if (ptr)
						ptr[parts[idx]] = instance;

					classes[name] = instance;

					return instance;
				});

}
