function __method_wrapper__() {
			get: function(keys) {
				var ret = {};

				if (Object.prototype.toString.call(keys) !== "[object Array]") {
					keys = [keys];
				}
				for (var i=0; i<keys.length; i++) {
					ret[keys[i]] = readCookie(keys[i]);
				}
				if (keys.length < 2) {
					if (keys.length > 0 && (keys[0] in ret)) {
						return ret[keys[0]];
					}
					return;
				}
				return ret;
			},

}
