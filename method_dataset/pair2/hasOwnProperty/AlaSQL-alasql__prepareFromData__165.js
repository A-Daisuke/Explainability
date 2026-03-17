function __method_wrapper__() {
alasql.prepareFromData = function (data, array) {
	let res = data;
	if (typeof data === 'string') {
		res = data.split(/\r?\n/);
		if (array) {
			res = res.map(item => [item]);
		}
	} else if (array) {
		res = data.map(item => [item]);
	} else if (typeof data === 'object' && !Array.isArray(data)) {
		if (
			typeof Mongo !== 'undefined' &&
			typeof Mongo.Collection !== 'undefined' &&
			data instanceof Mongo.Collection
		) {
			res = data.find().fetch();
		} else {
			res = [];
			for (const key in data) {
				if (data.hasOwnProperty(key)) res.push([key, data[key]]);
			}
		}
	}
	return res;
};

}
