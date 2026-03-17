function putIntoDB(key,vals) {
	var args = Array.prototype.slice.call(arguments);

	return ASQ()
	.promise(function(done){
		// multiple-statement save transaction?
		if (Array.isArray(key)) {
			DB_store.multi();

			args.forEach(function(arg){
				var key = arg[0], vals = arg[1];
				DB_store.hmset(key,vals);
			});

			return DB_store.exec();
		}
		// otherwise, single statement save
		else {
			return DB_store.hmset(key,vals);
		}
	});
}
