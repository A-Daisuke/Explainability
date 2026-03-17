function __method_wrapper__() {
	.seq(function(){
		var segments = Array.prototype.slice.call(arguments)
		.map(function(arg){
			return function __segment__(done) {
				emailUser(arg[0],arg[1])
				.pipe(done);
			};
		});

		return ASQ()
		.gate.apply(ø,segments)
		.val(function(){
			DB_store.connection.end();
			smtpTransport.close();
			console.log("All done");
		});
	})

}
