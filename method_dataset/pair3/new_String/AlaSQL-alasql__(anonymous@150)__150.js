function __method_wrapper__() {
	it('6. ORDER BY two columns', function (done) {
		var t4 = [
			{Email: new String('A'), ID: new String('s1')},
			{Email: new String('B'), ID: new String('s2')},
			{Email: new String('A'), ID: new String('s3')},
		];
		//alasql.options.valueof = true;
		alasql('CREATE TABLE T4 (Email string, ID string)');
		alasql.tables['T4'].data = t4;

		var res = alasql('SELECT * FROM T4 ORDER BY Email ASC, ID ASC', [t4]);

		assert.equal(res[0].Email.valueOf(), 'A');
		assert.equal(res[0].ID.valueOf(), 's1');

		done();
	});

}
