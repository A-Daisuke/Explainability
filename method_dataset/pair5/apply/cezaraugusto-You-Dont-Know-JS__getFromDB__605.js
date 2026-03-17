function getFromDB(key,fields) {
	var sq = ASQ();

	if (fields) {
		if (!Array.isArray(fields)) {
			fields = [fields];
		}

		sq
		.promise(
			DB_store.hmget.apply(DB_store,[key].concat(fields))
		)
		.val(function(vals){
			var tmp;
			if (Array.isArray(vals)) {
				tmp = {};
				vals.forEach(function(val,idx){
					tmp[fields[idx]] = val;
				});
				vals = tmp;
			}
			return vals;
		});
	}
	else {
		sq
		.promise(
			DB_store.hgetall(key)
		);
	}

	// see if we need to JSON.parse() the values
	return sq.val(function(vals){
		vals = vals || {};
		Object.keys(vals).forEach(function(idx){
			if (typeof vals[idx] === "string" && /^json:/.test(vals[idx])) {
				try { vals[idx] = JSON.parse(vals[idx].substr(5)); } catch (err) { }
			}
			else if (vals[idx] === null) {
				delete vals[idx];
			}
		});
		return vals;
	});
}
