	function test(M) {
		alasql('DELETE FROM one;');
		alasql('DELETE FROM two;');
		alasql('DELETE FROM three;');
		alasql('DELETE FROM four;');

		for (var i = 0; i < M[0]; i++) {
			for (var j = 0; j < M[1]; j++) {
				alasql('INSERT INTO one VALUES ?', [{a: i, b: j}]);
			}
			for (var j = 0; j < M[2]; j++) {
				alasql('INSERT INTO two VALUES ?', [{b: i, c: j}]);
			}
			for (var j = 0; j < M[3]; j++) {
				alasql('INSERT INTO three VALUES ?', [{c: i, d: j}]);
			}
			for (var j = 0; j < M[4]; j++) {
				alasql('INSERT INTO four VALUES ?', [{d: i, e: j}]);
			}
		}

		alasql.databases[alasql.useid].resetSqlCache();
		alasql.databases[alasql.useid].dbversion++;

		var tm1 = Date.now();

		var res1 = alasql(
			'SELECT * FROM one \
				INNER JOIN two ON one.b = two.b \
				INNER JOIN three ON two.c = three.c \
				INNER JOIN four ON three.d = four.d \
				'
		);

		var tm1 = Date.now() - tm1;

		alasql.databases[alasql.useid].resetSqlCache();
		alasql.databases[alasql.useid].dbversion++;

		var tm2 = Date.now();

		var res2 = alasql(
			'SELECT * \
				FROM four \
				INNER JOIN three ON three.d = four.d \
				INNER JOIN two ON two.c = three.c \
				INNER JOIN one ON one.b = two.b \
				'
		);

		var tm2 = Date.now() - tm2;

		if (res1.length !== res2.length) {
			throw new Error('Different results');
		}

		return [tm1, tm2];
	}
