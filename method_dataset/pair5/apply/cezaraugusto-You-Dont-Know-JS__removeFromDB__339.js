function removeFromDB(key,fields) {
	if (fields) {
		if (!Array.isArray(fields)) {
			fields = [fields];
		}

		return ASQ()
		.promise(
			DB_store
			.hdel.apply(
				DB_store,
				[key].concat(fields)
			)
		);
	}
	else {
		return ASQ()
		.promise(
			DB_store.del(key)
		);
	}
}
