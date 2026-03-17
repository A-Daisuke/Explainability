function handleRpcReply(expect, rc) {
	if (typeof(rc) == 'number' && rc != 0) {
		var e = new Error(rpc.getStatusText(rc)); e.name = rpcErrors[rc] || 'Error';
		throw e;
	}

	if (expect) {
		var type = Object.prototype.toString;

		for (var key in expect) {
			if (rc != null && key != '')
				rc = rc[key];

			if (rc == null || type.call(rc) != type.call(expect[key])) {
				var e = new Error(_('Unexpected reply data format')); e.name = 'TypeError';
				throw e;
			}

			break;
		}
	}

	return rc;
}
