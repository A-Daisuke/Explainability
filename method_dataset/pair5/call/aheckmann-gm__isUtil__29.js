function __method_wrapper__() {
exports.isUtil = function (v) {
	var ty = 'object';
	switch (Object.prototype.toString.call(v)) {
	case '[object String]':
		ty = 'String';
		break;
	case '[object Array]':
		ty = 'Array';
		break;
	case '[object Boolean]':
		ty = 'Boolean';
		break;
	}
	return ty;
}
}
