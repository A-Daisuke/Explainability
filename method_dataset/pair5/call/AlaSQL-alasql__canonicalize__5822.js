function __method_wrapper__() {
		exports.canonicalize = function (obj, stack) {
			stack = stack || [];

			if (exports.indexOf(stack, obj) !== -1) return '[Circular]';

			var canonicalizedObj;

			if ({}.toString.call(obj) === '[object Array]') {
				stack.push(obj);
				canonicalizedObj = exports.map(obj, function (item) {
					return exports.canonicalize(item, stack);
				});
				stack.pop();
			} else if (typeof obj === 'object' && obj !== null) {
				stack.push(obj);
				canonicalizedObj = {};
				exports.forEach(exports.keys(obj).sort(), function (key) {
					canonicalizedObj[key] = exports.canonicalize(obj[key], stack);
				});
				stack.pop();
			} else {
				canonicalizedObj = obj;
			}

			return canonicalizedObj;
		};

}
