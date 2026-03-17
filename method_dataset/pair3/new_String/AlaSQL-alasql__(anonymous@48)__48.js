class __C__ {
	it('3. Inner Select', function (done) {
		var t1 = [{Email: new String('A')}, {Email: new String('B')}];
		var t2 = [
			{Email: new String('A'), Study: new String('s1')},
			{Email: new String('B'), Study: new String('s2')},
			{Email: new String('B'), Study: new String('s3')},
		];
		var t3 = [
			{Name: new String('n1'), ID: new String('s1')},
			{Name: new String('n2'), ID: new String('s2')},
			{Name: new String('n3'), ID: new String('s3')},
		];
		alasql('CREATE TABLE T1 (Email string)');
		alasql.tables['T1'].data = t1;

		alasql('CREATE TABLE T2 (Email string, Study string)');
		alasql.tables['T2'].data = t2;
		alasql('CREATE TABLE T3 (Name string, ID string)');
		alasql.tables['T3'].data = t3;

		var res = alasql(
			'SELECT T2.`Study`, (SELECT T3.`Name` FROM T3 JOIN T2 WHERE T2.`Study` === T3.`ID`) AS `Focus` ' +
				'FROM T1 LEFT JOIN T2 ON T1.`Email` === T2.`Email`'
		);

		assert.equal(res.length, 3);
		assert.equal(res[0].Study, 's1');
		assert.equal(res[1].Study, 's2');
		assert.equal(res[2].Study, 's3');
		assert.equal(res[0].Focus, 'n1');
		assert.equal(res[1].Focus, 'n1');
		assert.equal(res[2].Focus, 'n1');
		done();
	});

}
