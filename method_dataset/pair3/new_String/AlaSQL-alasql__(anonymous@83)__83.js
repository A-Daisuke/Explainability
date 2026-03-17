function __method_wrapper__() {
	it('4. Join Using', function (done) {
		var t1 = [
			{Email: 'A', ID: new String('s1')},
			{Email: 'B', ID: new String('s2')},
			{Email: 'B', ID: new String('s3')},
		];
		var t2 = [
			{Name: 'n1', ID: new String('s1')},
			{Name: 'n2', ID: new String('s2')},
			{Name: 'n3', ID: new String('s3')},
		];

		var res = alasql('SELECT * FROM ? JOIN ? AS T2 USING ID', [t1, t2]);

		assert.equal(res.length, 3);
		assert.equal(res[0].Email, 'A');
		assert.equal(res[0].Name, 'n1');

		done();
	});

}
