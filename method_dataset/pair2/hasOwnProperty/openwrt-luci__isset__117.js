		var isset = function(val) {
			if (L.isObject(val) && !dom.elem(val)) {
				for (var k in val)
					if (val.hasOwnProperty(k))
						return true;

				return false;
			}
			else if (Array.isArray(val)) {
				return (val.length > 0);
			}
			else {
				return (val !== null && val !== undefined && val !== '' && val !== false);
			}
		};
