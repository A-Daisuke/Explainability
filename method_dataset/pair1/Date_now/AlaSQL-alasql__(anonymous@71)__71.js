function __method_wrapper__() {
		it('3.Complex test', function (done) {
			alasql(`
    DROP LOCALSTORAGE DATABASE IF EXISTS test001;
    CREATE LOCALSTORAGE DATABASE test001;
    ATTACH LOCALSTORAGE DATABASE test001;
    USE test001;
    CREATE TABLE one(a int, b string);
    `);

			var tm = Date.now();
			for (var i = 0; i < 10000; i++) {
				alasql('INSERT INTO one VALUES (?,?)', [1, 'one']);
			}
			//    console.log(alasql.tables.one);
			//alasql('COMMIT TRANSACTION');

			var res = alasql('SELECT VALUE COUNT(*) FROM one ');
			assert(res == 10000);
			var res = alasql('COMMIT TRANSACTION');

			//    console.log(res,Date.now()-tm);

			done();
		});

}
